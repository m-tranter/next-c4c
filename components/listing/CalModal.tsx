import type { Venue } from "@/lib/makeCal";
import Button from "@/components/shared/Button";
import styles from "./RegCal.module.css";

type CalModalProps = {
  venue: Venue;
  date: string;
  availability: string[];
  onClose: () => void;
};

export default function CalModal({
  venue,
  date,
  availability,
  onClose,
}: CalModalProps) {
  const currentCal = venue.cal[venue.ind];

  return (
    <div className="relative w-auto max-w-lg my-7 mx-auto pointer-events-none">
      <div className="relative flex flex-col w-full pointer-events-auto bg-white border border-gray-200 rounded-lg shadow-lg outline-none">
        <div className="flex items-top justify-between p-4 border-b border-gray-200 rounded-t-lg">
          <h2
            className={`${styles.modalHeading}  mx-auto font-semibold leading-tight`}
          >
            {venue.name}
          </h2>
          <Button
            $variant="1"
            className="box-content w-4 h-4 p-1 text-black border-none rounded opacity-50 hover:opacity-75 focus:shadow-none focus:outline-none focus:opacity-100"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="text-2xl">✕</span>
          </Button>
        </div>

        <div className="relative flex-auto p-4">
          <div className="text-left text-lg">
            <p className="mb-3">
              Availability for {date} {currentCal.monthStr} {currentCal.year}:
            </p>
            <ul className="list-disc pl-5 mb-4">
              {availability.map((timeSlot) => (
                <li key={timeSlot} className="py-0.5">
                  {timeSlot}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-gray-700">
            To book, call 01270 375140 (option 2).
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end p-3 border-t border-gray-200 rounded-b-lg gap-2">
          <Button $variant="2" onClick={onClose}>
            <>Close</>
          </Button>
        </div>
      </div>
    </div>
  );
}
