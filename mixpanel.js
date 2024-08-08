import mixpanel from 'mixpanel-browser';
import logger from '../util/logger';

const token = process.env.RUN_ENV === 'production' ? 'ded2f9f2edd63499b763c146b9b29f51' : 'b41ee25d578d15b1a46e90ae0a17f9a8';

if (process.env.RUN_ENV !== 'development') {
    mixpanel.init(token, {
        host: "api-eu.mixpanel.com",
        debug: process.env.RUN_ENV === 'development',
        persistence: "localStorage"
    });
}

const EVENTS = {
    NAMES: {
        DASHBOARD_EXPORTED: 'dashboard_exported',
        USERS_EXPORTED: 'users_exported',
        DASHBOARDS_ACTIVITY_EXPORTED: 'dashboard_activity_exported',
        CHART_EXPORTED: 'chart_exported',
        HOW_TO_OPENED: 'how_to_opened',
        PRICE_QUOTE_REQUEST_CLICKED: 'price_quote_request_clicked',
        WALLBOARD_URL_COPIED: 'wallboard_url_copied',
        TEAM_DASHBOARD_VIEWED: 'team_dashboard_viewed',
        PAGE_VIEWED: 'page_viewed',
        EXECUTIVE_REPORT_CONFIGURATION_CHANGED: 'executive_report_configuration_changed',
        EXECUTIVE_DASHBOARD_FILTERS_CHANGES: 'executive_dashboard_filters_changed',
        FILE_UPLOADED: 'file_uploaded',
        LOGOUT_COMPLETED: 'logout_completed',
        TEAM_DASHBOARD_VIEW_CHANGED: 'team_dashboard_view_changed',
        TEAM_DASHBOARD_VIEW_URL_COPIED: 'team_dashboard_view_url_copied',
        TEAM_DASHBOARD_CONFIGURATION_CHANGED: 'team_dashboard_configuration_changed',
        CHART_EXPORTED: 'chart_exported',
        SUBSCRIPTION_INFO_CONFIRMED: 'subscription_info_confirmed',
        EXECUTIVE_DASHBOARD_VIEWED: 'executive_dashboard_viewed',
        ERROR_VIEWED: 'ERROR_VIEWED'
    },
    CHART_EXPORT_FORMAT: {
        PRINT: 'print'
    },
}

export const PAGES = {
    LOGIN: 'login',
    REGISTER: 'register',
    HOSTS: 'hosts',
    CREATE: 'create',
    CONTACT_US: 'contact_us',
    TERMS: 'terms',
    PREMIUM: 'premium',
    SUBSCRIBE: 'subscribe',
    BOARD_LIMIT_REACHED: 'board_limit_reached',
    BILLING: 'billing',
    CONFIGURE: 'configure'
}

export const ERRORS = {
    BOARD_LIMIT_REACHED: 'board_limit_reached'
}

export function identifyMixpanelUser(userId, accountId, app) {
    try {
        if (mixpanel.__loaded) {
            mixpanel.identify(userId);

            mixpanel.register({
                account_id: accountId,
                app: app
            });
        }
    } catch (err) {
        logger.error(err, 'register properties');
    }
}

export function trackHowToOpened(details) {
    try {
        if (mixpanel.__loaded) {
            mixpanel.track(EVENTS.NAMES.HOW_TO_OPENED, { details: details });
        }
    } catch (err) { }
}

export function trackLoginPageView(app) {
    trackToMixpanel(EVENTS.NAMES.PAGE_VIEWED, {
        page: PAGES.LOGIN,
        app: app
    });
}

export function trackPageView(page) {
    trackToMixpanel(EVENTS.NAMES.PAGE_VIEWED, { page: page });
}

export function trackTeamDashboardView(chart) {
    trackToMixpanel(EVENTS.NAMES.TEAM_DASHBOARD_VIEWED, { chart: chart });
}

export function trackFileUpload(format) {
    trackToMixpanel(EVENTS.NAMES.FILE_UPLOADED, { format: format });
}

export function trackExecutiveFilterChange(dashboardNames, change, changeDetails) {
    trackToMixpanel(EVENTS.NAMES.EXECUTIVE_DASHBOARD_FILTERS_CHANGES, {
        names: dashboardNames,
        change: change,
        change_details: changeDetails
    });
}

export function trackReportConfigChange(dashboardNames, change, changeDetails) {
    trackToMixpanel(EVENTS.NAMES.EXECUTIVE_REPORT_CONFIGURATION_CHANGED,
        {
            names: dashboardNames,
            change: change,
            change_details: changeDetails
        });
}

export function trackPriceQuoteRequest() {
    trackToMixpanel(EVENTS.NAMES.PRICE_QUOTE_REQUEST_CLICKED);
}

export function trackDashboardActivityExport() {
    trackToMixpanel(EVENTS.NAMES.DASHBOARDS_ACTIVITY_EXPORTED);
}

export function trackDashboardExport(format) {
    trackToMixpanel(EVENTS.NAMES.DASHBOARD_EXPORTED, {
        format: format
    });
}

export function trackUsersExport() {
    trackToMixpanel(EVENTS.NAMES.USERS_EXPORTED);
}

export function trackWallboardURLCopied() {
    trackToMixpanel(EVENTS.NAMES.WALLBOARD_URL_COPIED);
}

export function trackTeamDashboardViewURLCopy() {
    trackToMixpanel(EVENTS.NAMES.TEAM_DASHBOARD_VIEW_URL_COPIED);
}

export function trackTeamDashboardConfigurationChange(chart, change, changeDetails) {
    trackToMixpanel(EVENTS.NAMES.TEAM_DASHBOARD_CONFIGURATION_CHANGED, {
        chart: chart,
        change: change,
        change_details: changeDetails
    });
}

export function trackChartExport(chart) {
    trackToMixpanel(EVENTS.NAMES.CHART_EXPORTED, {
        chart: chart
    });
}

export function trackSubscriptionInfoConfirm(plan, type, coupon, total) {
    trackToMixpanel(EVENTS.NAMES.SUBSCRIPTION_INFO_CONFIRMED, {
        plan: plan,
        type: type,
        coupon: coupon,
        total: total
    });
}

export function trackChartPointDetailsView(chart, isShown) {
    trackTeamDashboardConfigurationChange(chart, isShown ? 'show' : 'hide', 'details_view');
}

export function trackExecutiveDashboardView(view) { 
    trackToMixpanel(EVENTS.NAMES.EXECUTIVE_DASHBOARD_VIEWED, { view: view });
}

export function trackErrorViewed(error){
    trackToMixpanel(EVENTS.NAMES.ERROR_VIEWED, { error: error });
}

export function logoutMixpanelUser() {
    try {
        if (mixpanel.__loaded) {
            trackToMixpanel(EVENTS.NAMES.LOGOUT_COMPLETED);

            mixpanel.reset();
        }
    } catch (err) {
        logger.error(err, EVENTS.NAMES.LOGOUT_COMPLETED);
    }
}

function trackToMixpanel(eventName, properties) {
    try {
        if (mixpanel.__loaded) {
            mixpanel.track(eventName, properties);
        } 
    } catch (err) {
        logger.error(err, eventName);
    }
}

