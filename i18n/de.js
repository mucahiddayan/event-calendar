moment.locale('de', {
    months : 'Januar_Februar_März_April_Mai_June_Juli_August_September_Oktober_November_Dezember'.split('_'),
    monthsShort : 'Jan_Feb_Mar_Mai_Jun_Jul_Aug_Sep_Okt_Nov_Dez'.split('_'),
    monthsParseExact : true,
    weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
    weekdaysShort : 'Son_Mon_Die_Mit_Don_Fre_Sam'.split('_'),
    weekdaysMin : 'So_Mo_Mi_Do_Fr_Sa'.split('_'),
    weekdaysParseExact : true,
    longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    },
    calendar : {
        sameDay : '[Heute um] LT',
        nextDay : '[Morgen um] LT',
        nextWeek : 'dddd [am] LT',
        lastDay : '[Gestern um] LT',
        lastWeek : 'dddd [letzte Woche] LT',
        sameElse : 'L'
    },
    relativeTime : {
        future : 'in %s',
        past : 'il y a %s',
        s : 'wenige Sekunden',
        m : 'eine minute',
        mm : '%d minuten',
        h : 'eine Stunde',
        hh : '%d Stunden',
        d : 'ein Tag',
        dd : '%d Tage',
        M : 'ein Monat',
        MM : '%d Monate',
        y : 'ein Jahr',
        yy : '%d Jahre'
    },
    dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
    ordinal : function (number) {
        return number + (number === 1 ? '' : 'e');
    },
    meridiemParse : /PD|MD/,
    isPM : function (input) {
        return input.charAt(0) === 'M';
    },
    // In case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example).
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
    // },
    meridiem : function (hours, minutes, isLower) {
        return hours < 12 ? 'AM' : 'PM';
    },
    week : {
        dow : 1, // Monday is the first day of the week.
        doy : 4  // The week that contains Jan 4th is the first week of the year.
    }
});