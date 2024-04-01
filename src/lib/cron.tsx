/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, Tabs, TabsProps, Typography } from 'antd';
import cronstrue from 'cronstrue/i18n';
import { useEffect, useState } from 'react';
import { HeaderKeyType, HeaderValType, WEEKLY, loadHeaders, metadata } from './meta';

const { Text } = Typography;

interface CronProp {
  value?: string;
  onChange(val: string, text: string): void;
  showResultText: boolean;
  showResultCron: boolean;
  translateFn?(key: string): string;
  locale?: string;
  options?: { headers: HeaderKeyType[] };
  disabled?: boolean;
}

interface State {
  value: string[];
  selectedTab?: HeaderValType;
  headers: HeaderValType[];
  locale: string;
}

const defaultCron = '0 0/1 * * * ? *';

const Cron: React.FunctionComponent<CronProp> = ({
  options,
  locale,
  showResultText = false,
  showResultCron = false,
  translateFn,
  disabled,
  value,
  onChange,
}) => {
  const [state, setState] = useState<State>({
    value: [],
    headers: loadHeaders(options),
    locale: locale ?? 'en',
  });

  useEffect(() => {
    let newVal = '';
    newVal = state.value.toString().replace(/,/g, ' ');
    newVal = newVal.replace(/!/g, ',');

    if (value !== newVal) {
      setInitialValue(value ? value : '');
    }

    if (translateFn && !locale) {
      console.warn('Warning !!! locale not set while using translateFn');
    }
  }, [value]);

  useEffect(() => {
    state.value && state.value.length && parentChange(state.value);
  }, [state.value]);

  const setInitialValue = (value: string) => {
    let prevState = { ...state };
    prevState.value = value.replace(/,/g, '!').split(' ');
    const allHeaders = loadHeaders();

    if (value && value.split(' ').length === 6) {
      prevState.value.push('*');
    }

    if (!value || value.split(' ').length !== 7) {
      value = '0 0/1 * * * ? *';
      prevState.selectedTab = allHeaders[0];
      prevState.value = value.split(' ');

      parentChange(value.split(' '));
    } else {
      prevState.value = value.replace(/,/g, '!').split(' ');
    }

    let val = prevState.value;
    const second = val[1];
    const minute = val[2];
    const hour = val[3];
    const dayOfMonth = val[4];

    if (second.search('/') !== -1 && minute === '*' && hour === '1/1') {
      prevState.selectedTab = allHeaders[0];
    } else if (hour === '1/1') {
      prevState.selectedTab = allHeaders[1];
    } else if (hour.search('/') !== -1 || val[5] === WEEKLY.ALL) {
      prevState.selectedTab = allHeaders[2];
    } else if (hour === '?') {
      prevState.selectedTab = allHeaders[3];
    } else if (hour.startsWith('L') || dayOfMonth === '1/1') {
      prevState.selectedTab = allHeaders[4];
    } else {
      prevState.selectedTab = allHeaders[0];
    }

    if (!prevState.headers.includes(prevState.selectedTab)) {
      prevState.selectedTab = prevState.headers[0];
    }

    setState({ ...prevState });
  };

  const handleChangeTab = (tab: string) => {
    const selectedTab = tab as HeaderValType;

    if (state.selectedTab !== tab && !disabled) {
      setState({ ...state, selectedTab, value: defaultValue(selectedTab) });
    }
  };

  const onValueChange = (val: string[]) => {
    const initValue = ['0', '0', '00', '1/1', '*', '?', '*'];
    const newValue = val && val.length ? [...val] : initValue;

    setState({ ...state, value: newValue });
  };

  const parentChange = (val: string[]) => {
    let newVal = '';
    newVal = val.toString().replace(/,/g, ' ');
    newVal = newVal.replace(/!/g, ',');

    onChange(newVal, getVal());
  };

  const getVal = () => {
    const val = cronstrue.toString(
      state.value.toString().replace(/,/g, ' ').replace(/!/g, ','),
      { throwExceptionOnParseError: false, locale: state.locale }
    );

    if (val.search('undefined') === -1 && state.value && state.value.length) {
      return val;
    }

    return '---';
  };

  const defaultValue = (tab: HeaderValType): string[] => {
    const defaultValCron = metadata.find((m) => m.name === tab);

    if (!defaultValCron || !defaultValCron.initialCron) {
      return defaultCron.split(' ');
    }

    return defaultValCron.initialCron;
  };

  const translate = (key: string): string => {
    let translatedText = key;

    if (translateFn) {
      translatedText = translateFn(key);
      if (typeof translatedText !== 'string') {
        throw new Error('translateFn expects a string translation');
      }
    }

    return translatedText;
  };

  const getComponent = (tab: HeaderValType) => {
    const index = state.headers.indexOf(tab);
    let selectedMetaData = metadata.find((data) => data.name === tab);

    if (!selectedMetaData) {
      selectedMetaData = metadata[index];
    }

    if (!selectedMetaData) {
      throw new Error('Value does not match any available headers.');
    }

    if (state.value.length === 0) {
      return null;
    }

    const CronComponent = selectedMetaData.component;
    return (
      <CronComponent
        translate={translate}
        data={state.value}
        onChange={onValueChange}
        disabled={disabled}
      />
    );
  };

  const tabs: TabsProps['items'] = (state.headers || []).map((it) => {
    return {
      key: it,
      label: <Text strong>{translate(it)}</Text>,
      children: getComponent(it),
    };
  });

  return (
    <>
      <Tabs
        items={tabs}
        onChange={handleChangeTab}
        activeKey={state.selectedTab}
        style={{ marginBottom: 32 }}
      />

      {showResultText && (
        <Alert
          type="info"
          message={<Text>{getVal()}</Text>}
          style={{ marginTop: 16 }}
        />
      )}

      {showResultCron && (
        <Alert
          type="info"
          message={
            <Text>
              {state.value.length === 0
                ? '----'
                : state.value.toString().replace(/,/g, ' ').replace(/!/g, ',')}
            </Text>
          }
          style={{ marginTop: 16 }}
        />
      )}
    </>
  );
};

export default Cron;
