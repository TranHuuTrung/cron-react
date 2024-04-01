/* eslint-disable react-hooks/exhaustive-deps */
import { InputNumber, Radio, RadioChangeEvent, Space, Typography } from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';
import StartAtTime from '../start-at-time';

const { Text } = Typography;

interface MonthlyCronProp {
  onChange(e?: string[]): void;
  data: string[];
  translate(e: string): string;
  disabled?: boolean;
}

interface State {
  hour: number;
  minute: number;
  every: string;
}

enum MonthlyType {
  DayOfEveryMonth = 'DayOfEveryMonth',
  LastDayOfMonth = 'LastDayOfMonth',
  LastWeekOfMonth = 'LastWeekOfMonth',
  DayBeforeEndOfMonth = 'DayBeforeEndOfMonth',
}

const Monthly: FunctionComponent<MonthlyCronProp> = ({
  onChange,
  data,
  translate,
  disabled,
}) => {
  const [state, setState] = useState<State>({ hour: 0, minute: 0, every: '' });

  useEffect(() => {
    let every;

    if (data[3] === 'L') {
      every = MonthlyType.LastDayOfMonth;
    } else if (data[3] === 'LW') {
      every = MonthlyType.LastWeekOfMonth;
    } else if (data[3].startsWith('L')) {
      every = MonthlyType.DayBeforeEndOfMonth;
    } else {
      every = MonthlyType.DayOfEveryMonth;
    }

    setState({ ...state, every: every });
  }, []);

  const handleChangeRadio = (e: RadioChangeEvent) => {
    if (disabled) {
      return;
    }

    const checkedValue = e.target.value;
    setState({ ...state, every: checkedValue });

    const minute = data[1] === '*' ? '0' : data[1];
    const hour = data[2] === '*' ? '0' : data[2];

    if (checkedValue === MonthlyType.DayOfEveryMonth) {
      onChange(['0', minute, hour, '1', '1/1', '?', '*']);
    }

    if (checkedValue === MonthlyType.LastDayOfMonth) {
      onChange(['0', minute, hour, 'L', '*', '?', '*']);
    }

    if (checkedValue === MonthlyType.LastWeekOfMonth) {
      onChange(['0', minute, hour, 'LW', '*', '?', '*']);
    }

    if (checkedValue === MonthlyType.DayBeforeEndOfMonth) {
      onChange(['0', minute, hour, `L-${1}`, '*', '?', '*']);
    }
  };

  const onDayChange = (value: any) => {
    if (disabled) {
      return;
    }

    if ((parseInt(value) > 0 && parseInt(value) <= 31) || value === '') {
      const minute = data[1] === '*' ? '0' : data[1];
      const hour = data[2] === '*' ? '0' : data[2];

      let val = ['0', minute, hour, data[3], '1/1', '?', '*'];
      val[3] = `${value}`;
      onChange([...val]);
    }
  };

  const onLastDayChange = (value: any) => {
    if (disabled) {
      return;
    }

    if ((parseInt(value) > 0 && parseInt(value) <= 31) || value === '') {
      const minute = data[1] === '*' ? '0' : data[1];
      const hour = data[2] === '*' ? '0' : data[2];
      const val = ['0', minute, hour, data[3], '1/1', '?', '*'];
      const dayValue = value === '' ? '' : `L-${value}`;
      val[3] = dayValue;

      onChange([...val]);
    }
  };

  const renderDayOfEveryMonth = () => {
    return (
      <Space>
        <Text>{translate('Day')}</Text>
        <InputNumber
          value={state.every === MonthlyType.DayOfEveryMonth ? data[3] : 0}
          onChange={onDayChange}
          disabled={disabled || state.every !== MonthlyType.DayOfEveryMonth}
        />
        <Text>{translate('of every month(s)')}</Text>
      </Space>
    );
  };

  const renderLastDayOfMonth = () => {
    return <Text>{translate('Last day of every month')}</Text>;
  };

  const renderLastWeekOfMonth = () => {
    return <Text>{translate('On the last weekday of every month')}</Text>;
  };

  const renderDayBeforeEndOfMonth = () => {
    const dayOfMonth = data[3];
    const value =dayOfMonth.split('-').length &&dayOfMonth.split('-')[1] ?dayOfMonth.split('-')[1] : '';

    return (
      <Space>
        <InputNumber
          value={state.every === MonthlyType.DayBeforeEndOfMonth ? value : 0}
          onChange={onLastDayChange}
          disabled={disabled || state.every !== MonthlyType.DayBeforeEndOfMonth}
        />
        <Text>{translate('day(s) before the end of the month')}</Text>
      </Space>
    );
  };

  const options = [
    { value: 'DayOfEveryMonth', component: renderDayOfEveryMonth() },
    { value: 'LastDayOfMonth', component: renderLastDayOfMonth() },
    { value: 'LastWeekOfMonth', component: renderLastWeekOfMonth() },
    { value: 'DayBeforeEndOfMonth', component: renderDayBeforeEndOfMonth() },
  ];

  return (
    <Space direction="vertical">
      <Radio.Group
        onChange={handleChangeRadio}
        value={state.every}
        disabled={disabled}
      >
        <Space direction="vertical">
          {options.map((it) => (
            <Radio key={it.value} value={it.value} style={{ marginBottom: 16 }}>
              {it.component}
            </Radio>
          ))}
        </Space>
      </Radio.Group>

      <StartAtTime
        translate={translate}
        onChange={onChange}
        disabled={disabled}
        data={data}
      />
    </Space>
  );
};

export default Monthly;
