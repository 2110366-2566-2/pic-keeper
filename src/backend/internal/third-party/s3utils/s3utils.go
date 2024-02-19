package s3utils

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"sync"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type BucketBasics struct {
	S3Client *s3.Client
}

const awsRegion = "us-east-1"

var requiredBuckets = []string{
	"profile-picture",
}

var (
	instance *BucketBasics
	once     sync.Once
)

func createS3Client() (*s3.Client, error) {
	awsEndpoint := "http://localhost:4566"

	customResolver := aws.EndpointResolverWithOptionsFunc(func(service, region string, options ...interface{}) (aws.Endpoint, error) {
		if awsEndpoint != "" {
			return aws.Endpoint{
				PartitionID:   "aws",
				URL:           awsEndpoint,
				SigningRegion: awsRegion,
			}, nil
		}

		// returning EndpointNotFoundError will allow the service to fallback to its default resolution
		return aws.Endpoint{}, &aws.EndpointNotFoundError{}
	})

	awsCfg, err := config.LoadDefaultConfig(context.Background(),
		config.WithRegion(awsRegion),
		config.WithEndpointResolverWithOptions(customResolver),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider("test", "test", "test")),
	)
	if err != nil {
		return nil, err
	}

	// Create the resource client
	client := s3.NewFromConfig(awsCfg, func(o *s3.Options) {
		o.UsePathStyle = true
	})
	return client, nil
}

func newBucketBasics() (*BucketBasics, error) {
	client, err := createS3Client()
	if err != nil {
		log.Printf("Failed to create S3 client: %v", err)
		return nil, err
	}
	return &BucketBasics{S3Client: client}, nil
}

func GetInstance() (*BucketBasics, error) {
	var err error

	once.Do(func() {
		instance, err = newBucketBasics()
	})

	if err != nil {
		return nil, fmt.Errorf("Failed to initialize S3 client: %v", err) // Return after once.Do
	}
	return instance, nil
}

func (basics *BucketBasics) CreateBucket(name string, region string) error {
	_, err := basics.S3Client.CreateBucket(context.TODO(), &s3.CreateBucketInput{
		Bucket: aws.String(name),
	})
	if err != nil {
		log.Printf("Couldn't create bucket %v in Region %v. Here's why: %v\n",
			name, region, err)
	}
	return err
}

func InitializeS3() error {
	basics, err := GetInstance()
	if err != nil {
		return err
	}

	for _, bucketName := range requiredBuckets {
		err := basics.CreateBucket(bucketName, awsRegion)
		if err != nil {
			log.Printf("Failed to create bucket %s: %v", bucketName, err)
			continue
		}
	}

	log.Println("✅ Localstack connected successfully")
	return nil
}

func (basics *BucketBasics) UploadFile(ctx context.Context, bucketName string, objectKey string, data *bytes.Buffer, contentType string) error {
	dataBytes := data.Bytes()
	dataReader := bytes.NewReader(dataBytes)
	_, err := basics.S3Client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(bucketName),
		Key:         aws.String(objectKey),
		Body:        dataReader,
		ContentType: aws.String(contentType),
	})
	if err != nil {
		log.Printf("Couldn't upload file to %v:%v. Here's why: %v\n", bucketName, objectKey, err)
		return err
	}
	return nil
}
