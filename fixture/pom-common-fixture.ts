import {test as baseTest} from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { CommonUtils } from '../src/utils/CommonUtils';
import { DashboardPage } from '@/pages/DashboardPage';
import { UserPage } from '@/pages/UserPage';
import { LeftNavigationPage } from '@/pages/LeftNavigationPage';
import { PimPage } from '@/pages/PimPage';
import { CommonApiUtils } from '@/utils/CommonApiUtils';
import { request } from 'http';

type pomFixtures= {
    login:  LoginPage,
    common: CommonUtils,
    commonAPI: CommonApiUtils,
    dashboard: DashboardPage,
    userPage: UserPage,
    leftNavigationPage: LeftNavigationPage,
    pimPage: PimPage
}

export const test= baseTest.extend<pomFixtures>({
    login: async ({page}, use)=> { 
        await use(new LoginPage(page));
    },
    common: async ({}, use)=> {
        await use (new CommonUtils());
    },
    dashboard: async({page}, use)=> {
        await use(new DashboardPage(page))
    },
    userPage: async({page}, use)=> {
        await use(new UserPage(page))
    },
    leftNavigationPage: async({page}, use)=> {
        await use(new LeftNavigationPage(page))
    },
    pimPage: async({page}, use)=> {
        await use(new PimPage(page))
    },
    commonAPI: async({request}, use)=> {
        await use(new CommonApiUtils(request))

}
});
