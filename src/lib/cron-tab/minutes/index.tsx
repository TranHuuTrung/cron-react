import { Flex, InputNumber } from 'antd';
import { FunctionComponent } from 'react';

interface MinutesCronProp {
  onChange(e: string[]): void;
  data: string[];
  translate(e: string): string;
  disabled?: boolean;
}

const Minutes: FunctionComponent<MinutesCronProp> = ({
  onChange,
  data,
  translate,
  disabled,
}) => {
  const handleChange = (minute: number | null) => {
    if (disabled) {
      return;
    }

    if (!minute || (minute > 0 && minute < 60)) {
      let val = ['0', '*', '*', '*', '*', '?', '*'];
      val[1] = minute ? `0/${minute}` : val[1];

      onChange(val);
    }
  };

  const inputData = data[1].split('/')[1];

  return (
    <Flex align="center" gap={8}>
      {translate('Every')}
      <InputNumber
        min={1}
        max={60}
        onChange={handleChange}
        value={+inputData}
        disabled={disabled}
      />
      {translate('minute(s)')}
    </Flex>
  );
};

export default Minutes;
