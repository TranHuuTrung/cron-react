import { Input, Space, Typography } from 'antd';
import { useMemo } from 'react';

interface CustomCronProp {
  onChange(e: string[]): void;
  data: string[];
  translate(e: string): string;
  disabled?: boolean;
}

const { Text } = Typography;

const Custom: React.FunctionComponent<CustomCronProp> = ({
  translate: translateFn,
  disabled,
  data,
  onChange,
}) => {
  const handleChange = (e: { target: { value: string } }) => {
    if (disabled) return;

    onChange(e.target.value.replace(/,/g, '!')?.split(' '));
  };

  const val = useMemo(() => {
    return data.toString().replace(/,/g, ' ').replace(/!/g, ',');
  }, [data]);

  return (
    <Space align="center">
      <Text>{translateFn('Expression')}</Text>
      <Input value={val} disabled={disabled} onChange={handleChange} />
    </Space>
  );
};

export default Custom;
