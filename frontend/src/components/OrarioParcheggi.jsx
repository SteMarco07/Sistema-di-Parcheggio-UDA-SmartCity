import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import it from 'date-fns/locale/it';
import 'react-datepicker/dist/react-datepicker.css';
import { useStore } from '../store.jsx';

registerLocale('it', it);

function OrarioParcheggi({
    value,
    onChange,
    showSearch = true,
    showSubmit = true,
    onSearch,
    onSubmit,
    submitLabel = 'Cerca',
}) {
    const { setRicerca } = useStore();
    const now = new Date();
    now.setMinutes(0, 0, 0); // arrotonda all'ora

    const startInitial = new Date(now);
    const endInitial = new Date(startInitial);
    endInitial.setHours(startInitial.getHours() + 1);

    const controlled = value;

    const [startDateTime, setStartDateTime] = useState(value?.startDateTime ?? startInitial);
    const [endDateTime, setEndDateTime] = useState(value?.endDateTime ?? endInitial);

    useEffect(() => {
        if (controlled && value) {
            setStartDateTime(value.startDateTime);
            setEndDateTime(value.endDateTime);
        }
    }, [value, controlled]);

    const formatHour = (date) => {
        if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '00:00';
        return `${date.getHours().toString().padStart(2, '0')}:00`;
    };

    const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    const emitChange = (s, e) => {
        if (onChange) onChange({ startDateTime: s, endDateTime: e });
    };

    // Gestisce sia cambio data che ora di ingresso
    const handleStartChange = (newDate) => {
        const newStart = new Date(newDate);
        newStart.setMinutes(0, 0, 0);

        const newEnd = new Date(newStart);
        newEnd.setHours(newEnd.getHours() + 1);

        if (!controlled) {
            setStartDateTime(newStart);
            setEndDateTime(newEnd);
        }
        emitChange(newStart, newEnd);
    };

    const handleStartTimeChange = (time) => {
        const [hours] = time.split(':').map(Number);
        const newStart = new Date(startDateTime);
        newStart.setHours(hours, 0, 0, 0);

        const newEnd = new Date(newStart);
        newEnd.setHours(newEnd.getHours() + 1);

        if (!controlled) {
            setStartDateTime(newStart);
            setEndDateTime(newEnd);
        }
        emitChange(newStart, newEnd);
    };

    const handleEndTimeChange = (time) => {
        const [hours] = time.split(':').map(Number);
        const newEnd = new Date(endDateTime);
        newEnd.setHours(hours, 0, 0, 0);
        if (!controlled) setEndDateTime(newEnd);
        emitChange(startDateTime, newEnd);
    };

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

    const handleSearchChange = (e) => {
        const v = e.target.value;
        if (onSearch) onSearch(v);
        else setRicerca(v);
    };

    const handleSubmit = () => {
        if (onSubmit) onSubmit({ startDateTime, endDateTime });
    };

    return (
        <div className="card bg-base-100 shadow-sm mb-4">
            <div className="card-body p-3 sm:p-4">

                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">

                    {showSearch && (
                        <div className="w-full relative">
                            <div className="absolute -top-2 left-3 px-1 bg-base-100 text-xs text-neutral font-medium">
                                Ricerca
                            </div>
                            <div className="flex flex-row items-center gap-2 w-full border border-base-300 rounded-lg p-2 pt-3">
                                <input
                                    type="text"
                                    placeholder="Cerca..."
                                    onChange={handleSearchChange}
                                    className="input input-bordered flex flex-row items-center gap-2 w-full"
                                />
                            </div>
                        </div>
                    )}

                    {/* INGRESSO */}
                    <div className="w-full relative">
                        <div className="absolute -top-2 left-3 px-1 bg-base-100 text-xs text-neutral font-medium">
                            Ingresso
                        </div>
                        <div className="flex flex-row items-center gap-2 w-full border border-base-300 rounded-lg p-2 pt-3">

                            <div className="flex-1">
                                <DatePicker
                                    selected={startDateTime}
                                    onChange={handleStartChange}
                                    dateFormat="dd/MM/yyyy"
                                    minDate={new Date()}
                                    locale="it"
                                    customInput={<CustomInput placeholder="Data" />}
                                />
                            </div>

                            <select
                                className="select select-bordered w-24"
                                value={formatHour(startDateTime)}
                                onChange={(e) => handleStartTimeChange(e.target.value)}
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
                                    selected={endDateTime}
                                    onChange={(date) => {
                                        if (!controlled) setEndDateTime(date);
                                        emitChange(startDateTime, date);
                                    }}
                                    dateFormat="dd/MM/yyyy"
                                    locale="it"
                                    minDate={startDateTime}
                                    customInput={<CustomInput placeholder="Data" />}
                                />
                            </div>

                            <select
                                className="select select-bordered w-24"
                                value={formatHour(endDateTime)}
                                onChange={handleEndTimeChange}
                            >
                                {timeSlots.map(time => (
                                    <option key={time}>{time}</option>
                                ))}
                            </select>

                        </div>
                    </div>

                    {/* BOTTONE */}
                    {showSubmit && (
                        <div className="w-full lg:w-auto flex justify-end">
                            <button type="button" onClick={handleSubmit} className="btn btn-neutral w-full lg:w-auto">
                                {submitLabel}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrarioParcheggi;