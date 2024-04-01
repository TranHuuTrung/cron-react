import {
  Select,
  Space,
  Typography
} from 'antd';
import { FunctionComponent } from 'react';
import { buildOptions } from '../../utils';

const { Text } = Typography;

interface StartAtTimeCronProp {
  onChange(e?: string[]): void;
  data: string[];
  translate(e: string): string;
  disabled?: boolean;
  label?: string;
}

const StartAtTime: FunctionComponent<StartAtTimeCronProp> = ({
  onChange,
  data,
  translate,
  disabled,
  label,
}) => {
  const onValueChange = (cronPosition: number, value: string) => {
    const val = data;
    val[cronPosition] = `${value}`;

    onChange([...val]);
  };

  return (
    <Space style={{ marginTop: 16 }}>
      <Text>{label ?? translate('Start time')}</Text>
      <Select
        style={{ width: 100 }}
        options={buildOptions(24)}
        value={data[2]}
        onChange={(e) => onValueChange(2, e)}
        disabled={disabled}
      />
      <Select
        style={{ width: 100 }}
        options={buildOptions(60)}
        value={data[1]}
        onChange={(e) => onValueChange(1, e)}
        disabled={disabled}
      />
    </Space>
  );
};

export default StartAtTime;
