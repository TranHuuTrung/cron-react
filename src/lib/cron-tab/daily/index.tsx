/* eslint-disable react-hooks/exhaustive-deps */
import {
  InputNumber,
  Radio,
  RadioChangeEvent,
  Space,
  Typography
} from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';
import StartAtTime from '../start-at-time';

const { Text } = Typography;

interface DailyCronProp {
  onChange(e?: string[]): void;
  data: string[];
  translate(e: string): string;
  disabled?: boolean;
}

interface State {
  hour: number;
  minute: number;
  every: boolean;
}

const Daily: FunctionComponent<DailyCronProp> = ({
  translate,
  data,
  onChange,
  disabled,
}) => {
  const [state, setState] = useState<State>({
    hour: 0,
    minute: 0,
    every: false,
  });

  useEffect(() => {
    setState({ ...state, every: data[3] !== '?' });
  }, []);

  const onValueChange = (cronPosition: number, value: string) => {
    let val = data;
    val[cronPosition] = `${value}`;

    onChange([...val]);
  };

  const handleDayChange = (day: number | null) => {
    if (disabled) {
      return;
    }

    if (!day || (day > 0 && day < 32)) {
      onValueChange(3, day ? `1/${day}` : `${day}`);
    }
  };

  const handleChange = (e: RadioChangeEvent) => {
    if (disabled) {
      return;
    }

    const checkedValue = e.target.value;
    if (checkedValue === 'every') {
      setState({ ...state, every: true });
      onChange();
    }

    if (checkedValue === 'specific') {
      setState({ ...state, every: false });
      onChange(['0', data[1], data[2], '?', '*', 'MON-FRI', '*']);
    }
  };

  const everyOption = () => {
    return (
      <Space>
        <Text>{translate('Every')} </Text>
        <InputNumber
          disabled={!state.every || disabled}
          onChange={handleDayChange}
          min={1}
          max={31}
          value={data[3]?.split('/')[1] ? +data[3]?.split('/')[1] : 1}
        />
        <Text>{translate('day(s)')}</Text>
      </Space>
    );
  };

  const dailyOption = () => {
    return <Text>{translate('Every week day')}</Text>;
  };

  return (
    <Space direction="vertical">
      <Space>
        <Radio value="every" onChange={handleChange} checked={state.every} />
        {everyOption()}
      </Space>

      <Space style={{ marginTop: 16 }}>
        <Radio
          value="specific"
          onChange={handleChange}
          checked={!state.every}
        />
        {dailyOption()}
      </Space>
 
      <StartAtTime
        translate={translate}
        onChange={onChange}
        disabled={disabled}
        data={data}
      />
    </Space>
  );
};

export default Daily;
