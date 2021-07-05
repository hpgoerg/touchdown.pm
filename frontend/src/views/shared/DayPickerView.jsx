/**
 * @module DayPickerView
 *
 * @description
 * View dialog component to edit a date
 *
 * @author Hans-Peter Görg
 **/
import React, {useCallback, useEffect, useState} from 'react';
import moment from "moment";
import {Button, Calendar, Layer} from "grommet";
import {getUserLocale} from 'get-user-locale';
import {startsWith} from 'lodash';


export default function DayPickerView({date, setDate}) {
    const [openCalendar, setOpenCalendar] = useState(false);
    const [label, setLabel] = useState(moment(date).format("DD.MM.yyyy"));
    const locale = getUserLocale();

    const getFormattedDate = useCallback(() => {
        if(startsWith(locale,'de')) {
            return moment(date).format("DD.MM.yyyy");
        } else {
            return moment(date).format("MM/DD/yyyy")
        }
    },[date, locale]);


    useEffect(() => {
        setLabel(getFormattedDate());
    }, [date, getFormattedDate]);

    const close = (e) => {
        e.preventDefault();
        setOpenCalendar(false)
    }

    const open = (e) => {
        e.preventDefault()
        setOpenCalendar(true);
    };

    const onSelect = (date) => {
        setDate(date);
        setLabel(getFormattedDate());
        setOpenCalendar(false);
    };


    return (
        <>
            <Button margin={{left: "small", top: "small", bottom: "medium"}}
                    plain
                    label={label}
                    onClick={open}>
            </Button>

            {openCalendar &&
            <Layer
                onEsc={close}
                onClickOutside={close}>

                <Calendar
                    daysOfWeek={true}
                    size="medium"
                    locale={locale}
                    date={moment(date).local().toISOString()}
                    onSelect={onSelect}>
                </Calendar>
             </Layer>
            }
        </>
    );
}
