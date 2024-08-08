var Mixpanel = require('mixpanel');
import { getSubdomain } from '../util/url';
import { UAParser } from 'ua-parser-js';
import logger from '../util/logger';

var token = process.env.RUN_ENV === 'production' ? "ded2f9f2edd63499b763c146b9b29f51" : "b41ee25d578d15b1a46e90ae0a17f9a8";

let mixpanel;

if (process.env.RUN_ENV !== 'development') {
    mixpanel = Mixpanel.init(token, {
        host: "api-eu.mixpanel.com",
    });
}

export const EVENTS = {
    NAMES: {
        PAGE_VIEWED: 'page_viewed',
        SIGNUP_COMPLETED: 'signup_completed',
        USER_JOINED: 'user_joined',
        USERS_CHANGED: 'users_changed',
        USERS_VIEWED: 'users_viewed',
        DASHBOARD_PERMISSIONS_CHANGED: 'dashboard_permissions_changed',
        TEAM_DASHBOARD_CREATED: 'team_dashboard_created',
        TEAM_DASHBOARD_CHANGED: 'team_dashboard_changed',
        TEAM_DASHBOARD_VIEW_CHANGED: 'team_dashboard_view_changed',
        PREMIUM_TRIAL_STARTED: 'premium_trial_started',
        REPORT_EXPORTED: 'report_exported',
        SUBSCRIPTION_INFO_CONFIRMED: 'subscription_info_confirmed',
        SUBSCRIPTION_CHANGED: 'subscription_changed',
        DASHBOARD_ACTIVITY_VIEWED: 'dashboard_activity_viewed',
        WALLBOARD_CREATED: 'wallboard_created',
        WALLBOARD_CHANGED: 'wallboard_changed',
        WALLBOARD_VIEWED: 'wallboard_viewed',
        FORECAST_CREATED: 'forecast_created',
        FORECAST_VIEWED: 'forecast_viewed',
        FORECAST_CHANGED: 'forecast_changed',
        EXECUTIVE_DASHBOARD_VIEWED: 'executive_dashboard_viewed',
        EXECUTIVE_REPORT_VIEWED: 'executive_report_viewed',
        EXECUTIVE_DASHBOARD_CREATED: 'executive_dashboard_created',
        EXECUTIVE_DASHBOARD_CHANGED: 'executive_dashboard_changed',
        PAYMENT_COMPLETED: 'payment_completed',
        TEAM_DASHBOARD_CONFIGURATION_CHANGED: 'team_dashboard_configuration_changed',
        EXECUTIVE_DASHBOARD_VIEW_CHANGED: 'executive_dashboard_view_changed'
    },
    PAGES: {
        HOME: 'home',
        WALLBOARDS: 'wallboards',
        FORECASTS: 'forecasts'
    },
    USERS_CHANGE_ACTIONS: {
        INVITED: 'invited',
        DELETED: 'deleted',
        GENERAL_PERMISSIONS_CHANGED: 'general_permission_changed'
    },
    REPORT_TYPES: {
        EXECUTIVE: 'executive_dashboard',
        COMPARISON: 'executive_report'
    },
    SUBSCRIPTION_ACTION: {
        ACTIVATED: 'activated',
        CANCELED: 'canceled',
        RENEWAL_ON: 'renewal_on',
        RENEWAL_OFF: 'renewal_off',
        UPGRADED: 'upgraded',
        DOWNGRADED: 'downgraded'
    },
    ACTION: {
        EDITED: 'edited',
        DELETED: 'deleted'
    },
    VIEW_ACTION: {
        OPENED: 'opened',
        SAVED: 'saved',
        APPLIED: 'applied',
        URL_COPIED: 'url_copied'
    }
}

export function track(eventName, req, properties) {
    try {
        if (mixpanel) {
            if (!properties)
                properties = {};

            if (properties.distinct_id === undefined && req.user && req.user._id) {
                properties.distinct_id = req.user._id.toString();
                properties.account_id = req.user.selectedAccount;
            }
            properties.app = getSubdomain(req.subdomains);
            properties['$referrer'] = req.headers['referer'];
            properties["$referring_domain"] = req.headers['host'];

            var userAgentParser = new UAParser(req.headers['user-agent']);

            properties['$browser'] = userAgentParser.getBrowser().name;
            properties['$device'] = userAgentParser.getDevice().model;
            properties['$os'] = userAgentParser.getOS().name;

            if (properties.distinct_id) {
                mixpanel.track(eventName, properties);
            }
        } 
    } catch (err) {
        logger.error(err);
    }
}

export function trackPaymentComplete(req, total, paymentType, paymentMethod) {
    const properties = {
        payment_method: paymentMethod || (req.body.type === 'card' ? 'card' : (req.body.threeDS ? '3DS' : 'paypal')),
        payment_type: paymentType,
        plan: req.body.planName,
        type: req.body.planType,
        total: total
    };

    track(EVENTS.NAMES.PAYMENT_COMPLETED, req, properties);
}

export function trackSubscriptionChange(req, action) {
    const properties = {
        action: action,
        plan: req.body.planName
    };

    track(EVENTS.NAMES.SUBSCRIPTION_CHANGED, req, properties);
}

export function trackSignUpComplete(req, userId, accounId) {
    track(EVENTS.NAMES.SIGNUP_COMPLETED, req, {
        distinct_id: userId,
        account_id: accounId
    });
}

export function trackUserJoin(req, userId, accounId) {
    track(EVENTS.NAMES.USER_JOINED, req, {
        distinct_id: userId,
        account_id: accounId
    });
}

module.exports = {
    track,
    trackPaymentComplete,
    trackSubscriptionChange,
    trackSignUpComplete,
    trackUserJoin,
    EVENTS
};