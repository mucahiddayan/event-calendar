/**
 * @author Mücahid Dayan 
 * 
 */

const eventCalendarDependencies = [];
const eventCalendar = angular.module('eventCalendar', eventCalendarDependencies);

eventCalendar.controller('eventCalendarMainController', [() => {

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