/**
 * @author Mücahid Dayan
 * @description AngularJS Event Calendar Module with Scheduler
 * 
 */



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

eventCalendar.directive('calendar', [() => {
    let link = (scope, element, attributes) => {
        let createDaysArray = date => {
            let days = [];
            let currentDate = date;
            let daysInMonth = date.daysInMonth();            
            for (let i = 0; i < daysInMonth; i++) {
                days.push(date.date(1));
            }
            console.log(date);
            return days;
        }

        
        scope.calendar = {
            nextDay : () => {
                scope.calendar.today.add(1,'day');
                scope.calendar.updateCalendar();
            },
            prevDay : () => {
                scope.calendar.today.subtract(1,'day');
                scope.calendar.updateCalendar();
            },
            nextMonth : () => {
                scope.calendar.today.add(1,'month');
                scope.calendar.updateCalendar();
            },
            prevMonth : () => {
                scope.calendar.today.subtract(1,'month');
                scope.calendar.updateCalendar();
            },
            updateCalendar : () => {
                scope.daysInMonth = createDaysArray(scope.calendar.today);
                scope.calendar.currentFormattedMonth = scope.calendar.today.format('MMMM');
                scope.calendar.currentMonth = scope.calendar.today.format('MM');
                scope.calendar.currentYear = scope.calendar.today.format('YYYY');
            },
            goToToday : () => {
                scope.calendar.init();
            },
            init: () => {
                scope.calendar.today = moment();
                scope.calendar.updateCalendar();
            },
            today:null,
            currentFormattedMonth : null,
            currentMonth:null,
            currentYear:null,
        };

        scope.calendar.init();        
    }

    let template = (element, attributes) => {
        return `
            <div class="event-calendar-wrapper">
                <div class="event-calendar-view-wrapper">
                    <div class="controllers">
                        <i class="button prev" ng-click="calendar.prevMonth()">Prev</i>
                        <div class="calendar-infos">
                            <h5 ng-bind="calendar.currentFormattedMonth" ng-attr-title="calendar.currentMonth"></h5>
                            <h3 ng-bind="calendar.currentYear"></h3>
                        </div>
                        <i class="button next" ng-click="calendar.nextMonth()">Next</i>
                        <i class="button today" ng-click="calendar.goToToday()">Today</i>
                    </div>         
                    <div class="event-calendar-view">
                        <div class="days" ng-repeat="day in daysInMonth track by $index">
                            <span ng-bind="day.format('D')||day"></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    return {
        restrict: 'EA',
        scope: {

        },
        link,
        template,
    };
}]);