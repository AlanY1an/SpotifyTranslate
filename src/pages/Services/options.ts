import ChromeStorage from '../utils/chrome-storage';

// ✅ 定义 OptionKeys 类型
export type OptionKeys = 'selectedLanguage' | 'enableTranslation' | 'fontSize';

// ✅ 定义 OptionItem 结构
export interface OptionItem<T = any> {
  label: string;
  default: T;
  options?: Record<string, string>;
  value?: T;
}

// ✅ 定义所有选项
export const allOptions: Record<OptionKeys, OptionItem> = {
  enableTranslation: {
    label: 'Enable Translation',
    default: true,
  },
  selectedLanguage: {
    label: 'Language',
    default: 'English',
    options: {
      English: 'English',
      Spanish: 'Español',
      Chinese: '中文',
    },
  },
  fontSize: {
    label: 'Font Size',
    default: 1.0,
    value: 1.0,
  },
};

// ✅ 生成 `defaultOptions`
export const defaultOptions: Record<OptionKeys, any> = Object.keys(
  allOptions
).reduce((acc, key) => {
  const optionKey = key as OptionKeys;
  acc[optionKey] = allOptions[optionKey].default;
  return acc;
}, {} as Record<OptionKeys, any>);

// ✅ 创建 `ChromeStorage` 实例
const syncStorage = new ChromeStorage('sync');

// ✅ 读取 `chrome.storage.sync` 并返回 Promise
export async function getStoredOptions(): Promise<Record<OptionKeys, any>> {
  const savedOptions = await syncStorage.get<Record<OptionKeys, any>>(
    'options'
  );
  return { ...defaultOptions, ...savedOptions };
}

// ✅ 更新 `chrome.storage.sync`
export async function updateStoredOptions(
  newOptions: Partial<Record<OptionKeys, any>>
) {
  const storedOptions = await getStoredOptions();
  const updatedOptions = { ...storedOptions, ...newOptions };
  await syncStorage.set({ options: updatedOptions });
}

// ✅ 重置 `chrome.storage.sync` 到默认值
export async function resetStoredOptions() {
  await syncStorage.set({ options: defaultOptions });
}
