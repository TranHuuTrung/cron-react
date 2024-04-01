/* eslint-disable react-hooks/exhaustive-deps */
import { Checkbox, Col, Row } from 'antd';
import { FunctionComponent, useMemo } from 'react';
import StartAtTime from '../start-at-time';
import { WEEKLY } from '../../meta';

interface WeeklyCronProp {
  onChange(e?: string[]): void;
  data: string[];
  translate(e: string): string;
  disabled?: boolean;
}

const Weekly: FunctionComponent<WeeklyCronProp> = ({
  onChange,
  data,
  translate,
  disabled,
}) => {
  const weeklyOptions = useMemo(() => {
    return [
      { value: 'MON', label: translate('Monday') },
      { value: 'TUE', label: translate('Tuesday') },
      { value: 'WED', label: translate('Wednesday') },
      { value: 'THU', label: translate('Thursday') },
      { value: 'FRI', label: translate('Friday') },
      { value: 'SAT', label: translate('Saturday') },
      { value: 'SUN', label: translate('Sunday') },
    ];
  }, []);

  const handleChange = (value: string[]) => {
    if (disabled) {
      return;
    }

    let val = [...data];
    if (value.length === 0) {
      val[5] = '*';
    } else if (value.length === 7) {
      val[5] = WEEKLY.ALL;
    } else {
      val[5] = value.join('!');
    }

    onChange([...val]);
  };

  const getValue = () => {
    const dayOfWeek = data[5];

    if (!dayOfWeek || dayOfWeek === '*') {
      return [];
    }

    if (dayOfWeek === WEEKLY.ALL) {
      return [
        WEEKLY.MON,
        WEEKLY.TUE,
        WEEKLY.WED,
        WEEKLY.THU,
        WEEKLY.FRI,
        WEEKLY.SAT,
        WEEKLY.SUN,
      ];
    }

    return dayOfWeek.split('!');
  };

  return (
    <>
      <Checkbox.Group
        style={{ width: '100%', marginBottom: 16 }}
        onChange={handleChange}
        value={getValue()}
      >
        <Row>
          {weeklyOptions.map((it) => {
            return (
              <Col xs={24} sm={6} key={it.value}>
                <Checkbox value={it.value}>{it.label}</Checkbox>
              </Col>
            );
          })}
        </Row>
      </Checkbox.Group>

      <StartAtTime
        translate={translate}
        onChange={onChange}
        disabled={disabled}
        data={data}
      />
    </>
  );
};

export default Weekly;
