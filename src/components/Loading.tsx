import { Button, Spin } from 'antd';

export const Loading = ({
  initialLoading,
  total,
  fetchCompleted,
}: {
  initialLoading?: boolean;
  total?: number;
  fetchCompleted?: number;
}) => {
  return (
    <span>
      <Spin size="large" />
      <Button
        type="primary"
        size="large"
        style={{
          background: "red",
          borderColor: "red",
          fontWeight: "bold",
          marginRight: "5px",
        }}
        href="/"
      >
        {!total && !fetchCompleted && "Michelin Reservations Made Easy"}
        {total && `Progress: ${fetchCompleted} / ${total}`}
      </Button>
    </span>
  );
};
