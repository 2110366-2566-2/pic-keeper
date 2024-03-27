import React, { useEffect } from 'react';
import { useModal } from "@/context/ModalContext";
import userService from '@/services/user';
import { useErrorModal } from '@/hooks/useErrorModal';
import Image from 'next/image';
import checkmarkImage from '../../../public/images/Checkmark.png';

const PaymentSuccessful: React.FC = () => {
    const { closeModal } = useModal();

    useEffect(() => {
        const timer = setTimeout(() => {
            closeModal();
        }, 3000);

        return () => clearTimeout(timer);
    }, [closeModal]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
            <div className="bg-white p-5 rounded-lg text-center max-w-sm w-full">
                <div className="relative w-32 h-32 max-w-xs max-h-xs mx-auto mb-5">
                    <Image
                        src={checkmarkImage}
                        alt="Checkmark"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <h2 className="my-5 text-2xl text-black">Payment Successful</h2>
            </div>
        </div>
    );
};

export default PaymentSuccessful;
