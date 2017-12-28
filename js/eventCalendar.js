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
        let getDaysInMonth = date => {
            try {
                return calendarService.getDaysInMonth(date);
            } catch (e) {
                console.warn(e);
            }
        }

        let getDaysInWeek = date => {
            try {
                return calendarService.getDaysInWeek(date);
            } catch (e) {
                console.warn(e);
            }
        }
        

        scope.$on('goToPast', (event,data) => {
            scope.calendar.displayedDate = data.date;
            scope.calendar.updateCalendar();
        });

        scope.$on('goToFuture', (event,data) => {
            scope.calendar.displayedDate = data.date;
            scope.calendar.updateCalendar();
        });

        scope.$on('goToNextWeek', (event,data) => {
            scope.calendar.displayedDate = data.date;
            scope.calendar.updateCalendar();
        });

        scope.$on('goToPrevWeek', (event,data) => {
            scope.calendar.displayedDate = data.date;
            scope.calendar.updateCalendar();
        });

        scope.$on('displayedDateChanged', (event,data) => {
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
            goToNextMonth: () => {
                scope.calendar.displayedDate.add(1, 'month');
                scope.calendar.updateCalendar();
            },
            goToPrevMonth: () => {
                scope.calendar.displayedDate.subtract(1, 'month');
                scope.calendar.updateCalendar();
            },
            goToNextWeek:() => {
                scope.calendar.displayedDate.add(1, 'week');
                scope.calendar.updateCalendar();
            },
            goToPrevWeek: () => {
                scope.calendar.displayedDate.subtract(1, 'week');
                scope.calendar.updateCalendar();
            },
            updateCalendar: () => {
                try {
                    let view = scope.view || 'month';
                    switch(view){
                        case 'week':
                        scope.daysToView = getDaysInWeek(scope.calendar.displayedDate);break;
                        case 'month':
                        scope.daysToView = getDaysInMonth(scope.calendar.displayedDate);break;
                    }                    
                    calendarService.setDisplayedDate(scope,scope.calendar.displayedDate);
                    scope.calendar.currentFormattedMonth = scope.calendar.displayedDate.format('MMMM');
                    scope.calendar.currentMonth = scope.calendar.displayedDate.format('MM');
                    scope.calendar.currentYear = scope.calendar.displayedDate.format('YYYY');
                    scope.calendar.currentWeek = scope.calendar.displayedDate.weeks();
                    scope.calendar.nextWeek = moment(scope.calendar.displayedDate).add(1,'week').weeks();
                    scope.calendar.prevWeek = moment(scope.calendar.displayedDate).subtract(1,'week').weeks();
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
            currentWeek:null,
            currentYear: null,
            prevWeek:null,
            nextWeek:null,
            prevMonth:null,
            nextMonth:null,
        };        
        scope.calendar.init();
        console.log(scope.daysToView);
    }

    let template = (element, attributes) => {
        let view = attributes.view || 'month';
        let calendarView;
        switch (view) {
            case 'month':
                calendarView = '<month-view src="daysToView"></month-view>'; break;
            case 'week':
                calendarView = '<week-view src="daysToView"></week-view>'; break;
        }
        
        return `
            <div class="event-calendar-wrapper">
                <div class="event-calendar-view-wrapper">
                    <div class="controllers">
                        <i class="button prev prev-month" ng-click="calendar.goToPrevMonth()" ng-bind="calendar.prevMonth"></i>
                        <i class="button prev prev-week" ng-click="calendar.goToPrevWeek()" ng-bind="calendar.prevWeek"></i>
                        <i ng-bind="calendar.currentWeek"></i>
                        <i class="button next next-week" ng-click="calendar.goToNextWeek()" ng-bind="calendar.nextWeek"></i>
                        <i class="button next next-month" ng-click="calendar.goToNextMonth()" ng-bind="calendar.nextMonth"></i>
                        <div class="calendar-infos">
                            <h5 ng-bind="calendar.currentFormattedMonth" ng-attr-title="{{calendar.currentMonth}}"></h5>
                            <h3 ng-bind="calendar.currentYear"></h3>
                        </div>
                        
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

eventCalendar.directive('monthView', ['calendarService', (calendarService) => {
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
                return;
            }
            else if (calendarService.isNextMonth(date)) {
                calendarService.goToFuture(scope,date);
            }
            else if (calendarService.isPrevMonth(date)) {
                calendarService.goToPast(scope,date);
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

eventCalendar.directive('weekView', ['calendarService', (calendarService) => {
    let link = (scope, element) => {
        scope.isInThisWeek = date => {
            try {
                return !calendarService.isNextWeek(date) && !calendarService.isPrevWeek(date);
            } catch (e) {
                console.warn(e);
            }
        }
        scope.goToNextPrevWeek = date => {
            if (scope.isInThisWeek(date)) {
                return;
            }
            else if (calendarService.isNextWeek(date)) {
                calendarService.goToNextWeek(scope,date);
            }
            else if (calendarService.isPrevWeek(date)) {
                calendarService.goToPrevWeek(scope,date);
            }
        }
    }

    let template = () => {
        return `

            <div class="day" ng-repeat="day in src track by $index">
            <span ng-bind="day.format('D')" ng-attr-title="{{day.format('LL')}}"></span>
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

    let scopeCheck = scope => {
        if (!scope) {
            throw new Error('Scope is not defined');
        }
    }

    let setDisplayedDate = (scope,date) => {
        check(date);
        displayedDate = date;
        scopeCheck(scope);
        scope.$emit('displayedDateChanged', {date});
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

    let isNextWeek = date => {
        check(date);
        return date.isAfter(displayedDate, 'week');
    }

    let isPrevWeek = date => {
        check(date);
        return date.isBefore(displayedDate, 'week');
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
        scopeCheck(scope);
        scope.$emit('goToPast', {date});
    }

    let goToFuture = (scope,date) => {
        scopeCheck(scope);
        scope.$emit('goToFuture', {date});
    }

    let goToNextWeek = (scope,date) => {
        scopeCheck(scope);
        scope.$emit('goToNextWeek', {date});
    }

    let goToPrevWeek = (scope,date) => {
        scopeCheck(scope);
        scope.$emit('goToPrevWeek', {date});
    }

    let getDaysInMonth = date => {
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

    let getDaysInWeek = date => {
        check(date);
        return daysInMonth(date).filter(day => day.week() === date.week());
    }

    return {
        isToday,
        daysInMonth,
        getDaysInMonth,
        getDaysInWeek,
        today,
        isPrevMonth,
        isNextMonth,
        setDisplayedDate,
        getDisplayedDate,
        getToday,
        goToPast,
        goToFuture,
        isNextWeek,
        isPrevWeek,
        goToPrevWeek,
        goToNextWeek
    };
}]);