// BookingForm.tsx
import React from "react";

interface BookingFormProps {
  negotiatedPrice: number;
  setNegotiatedPrice: (value: number) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
  onSave: (e: React.FormEvent) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  negotiatedPrice,
  setNegotiatedPrice,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  onSave,
}) => {
  return (
    <form onSubmit={onSave} className="space-y-4 flex flex-col">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="startTime" className="label-normal">
            Start Time
          </label>
          <input
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            id="startTime"
            type="datetime-local"
            className="form-input"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="endTime" className="label-normal">
            End Time
          </label>
          <input
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            id="endTime"
            type="datetime-local"
            className="form-input"
          />
        </div>
        <div className="space-y-2 col-span-2">
          <label htmlFor="price" className="label-normal">
            Price
          </label>
          <input
            value={negotiatedPrice.toString()}
            onChange={(e) => setNegotiatedPrice(Number(e.target.value))}
            id="price"
            type="number"
            className="form-input"
          />
        </div>
      </div>
      <button className="btn-primary px-6 py-2 self-end" type="submit">
        Save
      </button>
    </form>
  );
};

export default BookingForm;
