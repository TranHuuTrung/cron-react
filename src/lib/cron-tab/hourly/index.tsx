import {
  InputNumber,
  Radio,
  RadioChangeEvent,
  Select,
  Space,
  Typography,
} from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';
import { buildOptions } from '../../utils';
import StartAtTime from '../start-at-time';

const { Text } = Typography;

interface HourlyCronProp {
  onChange(e?: string[]): void;
  data: string[];
  translate(e: string): string;
  disabled?: boolean;
}
interface State {
  every: boolean;
}

const Hourly: FunctionComponent<HourlyCronProp> = ({
  data,
  disabled,
  onChange,
  translate,
}) => {
  const [state, setState] = useState<State>({ every: false });

  useEffect(() => {
    const isEvery = Boolean(data[2]?.split('/')[1] || data[2] === '*');
    
    setState({ ...state, every: isEvery });
  }, [data]);

  const handleChange = (e: RadioChangeEvent) => {
    if (disabled) {
      return;
    }

    const checkedValue = e.target.value;
    if (checkedValue === 'every') {
      setState({ ...state, every: true });
      onChange(['0', '0', '0/1', '1/1', '*', '?', '*']);
    }

    if (checkedValue === 'specific') {
      setState({ every: false });
      onChange();
    }
  };

  const handleHourChange = (hour: number | null) => {
    if (!disabled && state.every && (!hour || (hour > 0 && hour < 24))) {
      const val = ['0', '0', '*', '*', '*', '?', '*'];
      val[1] = data[1];
      val[2] = hour ? `0/${hour}` : `${hour}`;
      val[3] = '1/1';

      onChange([...val]);
    }
  };

  const handleMinuteChange = (minute: number | null) => {
    if (!disabled && state.every && (!minute || (minute > 0 && minute < 60))) {
      const val = ['0', '0', '*', '*', '*', '?', '*'];
      val[1] = `${minute}`;
      val[2] = data[2];
      val[3] = '1/1';

      onChange([...val]);
    }
  };

  const handleAtHourChange = (selected: string) => {
    if (disabled) {
      return;
    }

    const val = ['0', data[1], '*', '1/1', '*', '?', '*'];
    val[2] = `${selected}`;

    onChange(val);
  };

  const handleAtMinuteChange = (selected: string) => {
    if (disabled) {
      return;
    }

    const val = ['0', '*', data[2], '1/1', '*', '?', '*'];
    val[1] = `${selected}`;

    onChange(val);
  };

  const everyOption = () => {
    return (
      <Space>
        <Text>{translate('Every')} </Text>
        <InputNumber
          disabled={!state.every || disabled}
          onChange={handleHourChange}
          min={0}
          max={24}
          value={state.every ? +data[2]?.split('/')[1] : 1}
        />
        <Text>{translate('hour')}</Text>
        <InputNumber
          disabled={!state.every || disabled}
          onChange={handleMinuteChange}
          value={state.every ? +data[1] : 0}
          min={0}
          max={60}
        />
        <Text>{translate('minute(s)')}</Text>
      </Space>
    );
  };

  const specificOption = () => {
    return (
      <Space>
        <Text>{translate('At')} </Text>
        <Select
          style={{ width: 100 }}
          disabled={state.every || disabled}
          options={buildOptions(24)}
          value={state.every ? '00' : data[2]}
          onChange={handleAtHourChange}
        />
        <Select
          style={{ width: 100 }}
          disabled={state.every || disabled}
          options={buildOptions(60)}
          value={state.every ? '00' : data[1]}
          onChange={handleAtMinuteChange}
        />
      </Space>
    );
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

        {specificOption()}

        {/* <StartAtTime
         translate={translate}
         onChange={onChange}
         disabled={disabled}
         data={data}
         label={translate('At')}
        /> */}
      </Space>
    </Space>
  );
};

export default Hourly;
