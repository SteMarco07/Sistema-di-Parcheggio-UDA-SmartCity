import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import it from 'date-fns/locale/it';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('it', it);

function OrarioParcheggi() {

    const now = new Date();

    // arrotonda all'ora
    const start = new Date(now);
    start.setMinutes(0);
    start.setSeconds(0);

    const end = new Date(start);
    end.setHours(start.getHours() + 1);

    const formatHour = (date) =>
        `${date.getHours().toString().padStart(2, '0')}:00`;

    const [startDate, setStartDate] = useState(start);
    const [startTime, setStartTime] = useState(formatHour(start));

    const [endDate, setEndDate] = useState(end);
    const [endTime, setEndTime] = useState(formatHour(end));

    // genera solo ore intere
    const timeSlots = Array.from({ length: 24 }, (_, i) =>
        `${i.toString().padStart(2, '0')}:00`
    );

    const CustomInput = ({ value, onClick, placeholder }) => (
        <div className="relative">
            <input
                className="input input-bordered w-full cursor-pointer pr-10"
                value={value}
                onClick={onClick}
                placeholder={placeholder || "Seleziona data"}
                readOnly
            />
        </div>
    );

    return (
        <div className="card bg-base-100 shadow-sm mb-4">
            <div className="card-body p-3 sm:p-4">

                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">

                    {/* INGRESSO */}
                    <div className="w-full relative">
                        <div className="absolute -top-2 left-3 px-1 bg-base-100 text-xs text-neutral font-medium">
                            Ingresso
                        </div>

                        <div className="flex flex-row items-center gap-2 w-full border border-base-300 rounded-lg p-2 pt-3">

                            <div className="flex-1">
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    minDate={new Date()}
                                    locale="it"
                                    customInput={<CustomInput placeholder="Data" />}
                                />
                            </div>

                            <select
                                className="select select-bordered w-24"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            >
                                {timeSlots.map(time => (
                                    <option key={time}>{time}</option>
                                ))}
                            </select>

                        </div>
                    </div>

                    {/* USCITA */}
                    <div className="w-full relative">
                        <div className="absolute -top-2 left-3 px-1 bg-base-100 text-xs text-neutral font-medium">
                            Uscita
                        </div>

                        <div className="flex flex-row items-center gap-2 w-full border border-base-300 rounded-lg p-2 pt-3">

                            <div className="flex-1">
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    locale="it"
                                    minDate={startDate}
                                    customInput={<CustomInput placeholder="Data" />}
                                />
                            </div>

                            <select
                                className="select select-bordered w-24"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            >
                                {timeSlots.map(time => (
                                    <option key={time}>{time}</option>
                                ))}
                            </select>

                        </div>
                    </div>

                    {/* BOTTONE */}
                    <div className="w-full lg:w-auto flex justify-end">
                        <button className="btn btn-neutral w-full lg:w-auto">
                            Cerca
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default OrarioParcheggi;