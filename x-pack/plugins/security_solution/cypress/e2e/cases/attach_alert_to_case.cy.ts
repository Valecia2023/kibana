/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { getNewRule } from '../../objects/rule';
import { ROLES } from '../../../common/test';

import { expandFirstAlertActions } from '../../tasks/alerts';
import { createRule } from '../../tasks/api_calls/rules';
import { cleanKibana } from '../../tasks/common';
import { waitForAlertsToPopulate } from '../../tasks/create_new_rule';
import { login, visit, waitForPageWithoutDateRange } from '../../tasks/login';

import { ALERTS_URL } from '../../urls/navigation';
import { ATTACH_ALERT_TO_CASE_BUTTON, ATTACH_TO_NEW_CASE_BUTTON } from '../../screens/alerts';
import { LOADING_INDICATOR } from '../../screens/security_header';

const loadDetectionsPage = (role: ROLES) => {
  login(role);
  waitForPageWithoutDateRange(ALERTS_URL, role);
  waitForAlertsToPopulate();
};

describe('Alerts timeline', () => {
  before(() => {
    // First we login as a privileged user to create alerts.
    cleanKibana();
    login();
    createRule(getNewRule());
    visit(ALERTS_URL);
    waitForAlertsToPopulate();
  });

  context('Privileges: read only', () => {
    beforeEach(() => {
      loadDetectionsPage(ROLES.reader);
    });

    it('should not allow user with read only privileges to attach alerts to existing cases', () => {
      // Disabled actions for read only users are hidden, so only open alert details button should show
      expandFirstAlertActions();
      cy.get(ATTACH_ALERT_TO_CASE_BUTTON).should('not.exist');
    });

    it('should not allow user with read only privileges to attach alerts to a new case', () => {
      // Disabled actions for read only users are hidden, so only open alert details button should show
      expandFirstAlertActions();
      cy.get(ATTACH_TO_NEW_CASE_BUTTON).should('not.exist');
    });
  });

  context('Privileges: can crud', () => {
    beforeEach(() => {
      loadDetectionsPage(ROLES.platform_engineer);
      cy.get(LOADING_INDICATOR).should('not.exist'); // on CI, waitForPageToBeLoaded fails because the loading icon can't be found
    });

    it('should allow a user with crud privileges to attach alerts to cases', () => {
      expandFirstAlertActions();
      cy.get(ATTACH_ALERT_TO_CASE_BUTTON).first().should('not.be.disabled');
    });
  });
});
