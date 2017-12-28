/**
 * @author Mücahid Dayan
 * @description AngularJS Event Calendar Module with Scheduler
 * 
 */


/**development */
let d__;
/** development ends */

/* angularjs init */

const eventCalendarDependencies = [];
const eventCalendar = angular.module('eventCalendar', eventCalendarDependencies);

eventCalendar.controller('eventCalendarMainController', ['$scope', ($scope) => {

}]);

eventCalendar.directive('eventCalendarScheduler', [() => {
    let link = (scope, element, attributes) => {
        console.log('Scheduler created');
    }

    let template = (element, attributes) => {
        return `
            <h1>Scheduler</h1>
        `;
    }
    return {
        restrict: 'EA',
        scope: {},
        link,
        template
    };
}]);

eventCalendar.directive('calendar', ['calendarService', (calendarService) => {
    let link = (scope, element, attributes) => {
        let getDays = date => {
            try {
                return calendarService.daysInMonthByWeek(date);
            } catch (e) {
                console.warn(e);
            }
        }

        scope.$on('goToPast', (event,args) => {
            scope.calendar.displayedDate = args.date;
            scope.calendar.updateCalendar();
        });

        scope.$on('goToFuture', (event,args) => {
            scope.calendar.displayedDate = args.date;
            scope.calendar.updateCalendar();
        });

        scope.calendar = {
            nextDay: () => {
                scope.calendar.displayedDate.add(1, 'day');
                scope.calendar.updateCalendar();
            },
            prevDay: () => {
                scope.calendar.displayedDate.subtract(1, 'day');
                scope.calendar.updateCalendar();
            },
            nextMonth: () => {
                scope.calendar.displayedDate.add(1, 'month');
                scope.calendar.updateCalendar();
            },
            prevMonth: () => {
                scope.calendar.displayedDate.subtract(1, 'month');
                scope.calendar.updateCalendar();
            },
            updateCalendar: () => {
                try {
                    scope.daysInMonth = getDays(scope.calendar.displayedDate);
                    calendarService.setDisplayedDate(scope.calendar.displayedDate);
                    scope.calendar.currentFormattedMonth = scope.calendar.displayedDate.format('MMMM');
                    scope.calendar.currentMonth = scope.calendar.displayedDate.format('MM');
                    scope.calendar.currentYear = scope.calendar.displayedDate.format('YYYY');
                } catch (e) {
                    console.warn(e);
                }
            },
            goToToday: () => {
                scope.calendar.init();
            },
            init: () => {
                scope.calendar.today = moment();
                scope.calendar.displayedDate = moment();
                scope.calendar.updateCalendar();
            },

            today: null,
            displayedDate: null,
            currentFormattedMonth: null,
            currentMonth: null,
            currentYear: null,
        };

        scope.calendar.init();
    }

    let template = (element, attributes) => {
        let view = attributes.view || 'month';
        let calendarView;
        switch (view) {
            case 'month':
                calendarView = '<days-in-month src="daysInMonth"></days-in-month>'; break;
            case 'week':
                calendarView = '<days-in-week src="daysInMonth"></days-in-week>'; break;
        }

        return `
            <div class="event-calendar-wrapper">
                <div class="event-calendar-view-wrapper">
                    <div class="controllers">
                        <i class="button prev" ng-click="calendar.prevMonth()">Prev</i>
                        <div class="calendar-infos">
                            <h5 ng-bind="calendar.currentFormattedMonth" ng-attr-title="{{calendar.currentMonth}}"></h5>
                            <h3 ng-bind="calendar.currentYear"></h3>
                        </div>
                        <i class="button next" ng-click="calendar.nextMonth()">Next</i>
                        <i class="button today" ng-click="calendar.goToToday()">Today</i>
                    </div>         
                    <div class="event-calendar-view">
                        ${calendarView}
                    </div>
                </div>
            </div>
        `;
    }

    return {
        restrict: 'EA',
        scope: {
            view: '@?'
        },
        link,
        template,
    };
}]);

eventCalendar.directive('daysInMonth', ['calendarService', (calendarService) => {
    let link = (scope, element) => {
        scope.isToday = date => {
            try {
                return calendarService.isToday(date);
            } catch (e) {
                console.warn(e);
            }
        }

        scope.isInThisMonth = date => {
            try {
                return !calendarService.isNextMonth(date) && !calendarService.isPrevMonth(date);
            } catch (e) {
                console.warn(e);
            }
        }
        scope.goToNextPrevMonth = date => {
            if (scope.isInThisMonth(date)) {
                console.log('Stay here');
                return;
            }
            else if (calendarService.isNextMonth(date)) {
                calendarService.goToFuture(scope,{date});
            }
            else if (calendarService.isPrevMonth(date)) {
                calendarService.goToPast(scope,{date});
            }
        }
    }

    let template = () => {
        return `
        <div class="days-in-week" ng-repeat="weekday in src track by $index">
            <div class="day" ng-click="goToNextPrevMonth(day)" ng-repeat="day in weekday track by $index" ng-class="{'today': isToday(day),'not-in-month': !isInThisMonth(day)}">
            <span ng-bind="day.format('D')" ng-attr-title="{{day.format('LL')}}"></span>
            </div>
        </div>
        `;
    }
    return {
        restrict: 'EA',
        link,
        template,
        scope: {
            src: '=?',
        }
    };
}]);

eventCalendar.factory('calendarService', [() => {
    let today = moment();
    let displayedDate = null;

    let check = date => {
        if (!date) {
            throw new Error('Date is not defined');
        }
        if (!date._isAMomentObject) {
            throw new Error('Date must be an moment object');
        }
    }

    let setDisplayedDate = date => {
        check(date);
        displayedDate = date;
        d__ = date;
    }

    let getToday = () => today;

    let getDisplayedDate = () => displayedDate;

    let isToday = date => {
        check(date);
        return date.isSame(today, 'day');
    }

    let isPrevMonth = date => {
        check(date);
        return date.isBefore(displayedDate, 'month');
    }

    let isNextMonth = date => {
        check(date);
        return date.isAfter(displayedDate, 'month');
    }

    let daysInMonth = date => {
        check(date);
        let days = [];
        for (let i = 1; i <= date.daysInMonth(); i++) {
            days.push(moment(date).date(i));
        }
        return days;
    };

    let goToPast = (scope,date) => {
        scope.$emit('goToPast', date);
    }

    let goToFuture = (scope,date) => {
        scope.$emit('goToFuture', date);
    }

    let daysInMonthByWeek = date => {
        check(date);
        let dIM = daysInMonth(date);
        let start = moment(date).startOf('month');
        let end = moment(date).endOf('month');
        let days = [];
        for (let i = 0; i < 7; i++) {
            days[i] = [];
        }
        for (let i = start.weekday(); i > 0; i--) {
            days[Math.abs(i - start.weekday())].push(moment(start).subtract(i, 'day'));
        }
        for (let i = start; i < (7 + start); i++) {
            days[i % 7].push(...dIM.filter(day => day.weekday() === i % 7));
        }
        for (let i = 6 - end.weekday(); i > 0; i--) {
            days[i + end.weekday()].push(moment(end).add(i, 'day'));
        }


        return days;
    }

    return {
        isToday,
        daysInMonth,
        daysInMonthByWeek,
        today,
        isPrevMonth,
        isNextMonth,
        setDisplayedDate,
        getDisplayedDate,
        getToday,
        goToPast,
        goToFuture
    };
}]);