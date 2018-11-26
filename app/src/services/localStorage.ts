import { Option, None, Try } from 'funfix-core';
import { Tab } from 'models';
import { JSONModel } from '@vzh/mobx-stores';

const storageKey = 'tabix';
const tabsKey = `${storageKey}.tabs`;
const tabsActiveKey = `${tabsKey}.active`;
const tabsIdsKey = `${tabsKey}.ids`;

export function saveTab(tab: Tab) {
  try {
    window.localStorage.setItem(`${tabsKey}.${tab.id}`, JSON.stringify(tab));
  } catch (e) {
    console.error(e);
  }
}

export function saveActiveTabId(id?: string) {
  try {
    if (!id) window.localStorage.removeItem(tabsActiveKey);
    else window.localStorage.setItem(tabsActiveKey, JSON.stringify(id));
  } catch (e) {
    console.error(e);
  }
}

export function getActiveTabId(): Option<string> {
  try {
    const value = window.localStorage.getItem(tabsActiveKey);
    return Option.of(value ? JSON.parse(value) : undefined);
  } catch (e) {
    console.error(e);
    return None;
  }
}

function removeAllTabs() {
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const key = window.localStorage.key(i) || '';
    if (key.startsWith(tabsKey) && key !== tabsActiveKey) {
      window.localStorage.removeItem(key);
    }
  }
}

export function saveTabs(tabs: ReadonlyArray<Tab>) {
  try {
    removeAllTabs();
    tabs.forEach(saveTab);
    const ids = tabs.map(t => t.id);
    window.localStorage.setItem(tabsIdsKey, JSON.stringify(ids));
    console.log('Tabs saved at', new Date().toISOString());
  } catch (e) {
    console.error(e);
  }
}

export function getTabs(): Try<JSONModel<ReadonlyArray<Tab>>> {
  return Try.of(() => {
    const idsJson = window.localStorage.getItem(tabsIdsKey);
    const ids: string[] = idsJson ? JSON.parse(idsJson) : [];
    const tabs = ids.reduce(
      (acc, id) => {
        const value = window.localStorage.getItem(`${tabsKey}.${id}`);
        return value ? acc.concat(JSON.parse(value)) : acc;
      },
      [] as JSONModel<Tab[]>
    );
    return tabs;
  });
}
