import { observable, action } from 'mobx';
import { UIStore, DisposableStore } from '@vzh/mobx-stores';
import { Connection } from 'services';
import AppStore from './AppStore';
import SignInStore from './SignInStore';
import DashboardStore from './DashboardStore';
import DashboardUIStore from './DashboardUIStore';

export default class RootStore extends DisposableStore {
  @observable
  appStore: AppStore;

  @observable
  signInStore: SignInStore;

  @observable
  dashboardStore: DashboardStore;

  constructor() {
    super();
    this.appStore = new AppStore(this, new UIStore(this));

    this.signInStore = new SignInStore(this, new UIStore(this));

    this.dashboardStore = new DashboardStore(this, new DashboardUIStore(this));
  }

  // refactor: temporary for HMR
  @action
  updateChildStores(rootStore: RootStore, connection?: Connection) {
    this.dispose();
    this.appStore = rootStore.appStore;
    this.signInStore = rootStore.signInStore;
    this.dashboardStore = rootStore.dashboardStore;
    connection && this.appStore.initApi(connection);
  }
}
