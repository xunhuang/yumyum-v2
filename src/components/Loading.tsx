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
        Michelin Reservations Made Easy
        {initialLoading && <span>Loading...</span>}
        {total && <span>Total: {total}</span>}
        {fetchCompleted && <span>Fetch Completed: {fetchCompleted}</span>}
      </Button>
    </span>
  );
};
