import {
  getStoredOptions,
  updateStoredOptions,
  resetStoredOptions,
} from '../Services/options';

// ✅ 统一处理表单 `onChange` 事件
export async function handleFormChange(event: Event) {
  const target = event.target as HTMLInputElement | HTMLSelectElement;
  const { name, type, value, checked } = target;

  // ✅ 根据 input 类型解析值
  const newValue = type === 'checkbox' ? checked : value;

  // ✅ 读取当前存储的 options 并更新
  const storedOptions = await getStoredOptions();
  const updatedOptions = { ...storedOptions, [name]: newValue };

  // ✅ 存入 `chrome.storage.sync`
  await updateStoredOptions(updatedOptions);
}

// ✅ 处理重置按钮点击
export async function handleReset() {
  await resetStoredOptions();
}
