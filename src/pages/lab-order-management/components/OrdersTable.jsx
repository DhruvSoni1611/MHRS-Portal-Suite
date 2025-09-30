import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const OrdersTable = ({
  orders,
  view,
  onOrderSelect,
  onUploadResults,
  priorityColors,
  statusColors,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const isOverdue = (dueDate, status) => {
    if (status === "completed") return false;
    const due = new Date(dueDate);
    const today = new Date();
    return due < today;
  };

  if (view === "cards") {
    return (
      <div className="space-y-4">
        <div className="bg-card rounded-lg border border-border p-6 shadow-clinical">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Laboratory Orders ({orders?.length})
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {orders?.map((order) => (
              <div
                key={order?.id}
                className="border border-border rounded-lg p-4 hover:shadow-clinical-lg transition-clinical bg-background"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {order?.id}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {order?.patientName} • {order?.patientAge}y •{" "}
                      {order?.patientGender}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        priorityColors?.[order?.priority]
                      }`}
                    >
                      {order?.priority?.toUpperCase()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors?.[order?.status]
                      } ${
                        isOverdue(order?.dueDate, order?.status)
                          ? "ring-2 ring-red-400"
                          : ""
                      }`}
                    >
                      {order?.status?.replace("-", " ")?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Test Types</p>
                    <p className="text-sm font-medium text-foreground">
                      {order?.testTypes?.join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Ordering Physician
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {order?.orderingPhysician}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Collection Date
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(order?.collectionDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p
                      className={`text-sm font-medium ${
                        isOverdue(order?.dueDate, order?.status)
                          ? "text-red-600"
                          : "text-foreground"
                      }`}
                    >
                      {formatDate(order?.dueDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    TAT: {order?.turnaroundTime} • {order?.orderingFacility}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onOrderSelect(order)}
                      iconName="Eye"
                      iconPosition="left"
                    >
                      View
                    </Button>
                    {order?.status !== "completed" && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onUploadResults(order)}
                        iconName="Upload"
                        iconPosition="left"
                      >
                        Upload Results
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-clinical overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">
          Laboratory Orders ({orders?.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Order Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Tests
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Physician
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {orders?.map((order) => (
              <tr
                key={order?.id}
                className="hover:bg-muted/50 transition-clinical cursor-pointer"
                onClick={() => onOrderSelect(order)}
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {order?.id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order?.orderingFacility}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {order?.patientName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order?.patientAge}y • {order?.patientGender} •{" "}
                      {order?.patientId}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-48">
                    <p
                      className="text-sm text-foreground truncate"
                      title={order?.testTypes?.join(", ")}
                    >
                      {order?.testTypes?.join(", ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      TAT: {order?.turnaroundTime}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      priorityColors?.[order?.priority]
                    }`}
                  >
                    {order?.priority?.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors?.[order?.status]
                    } ${
                      isOverdue(order?.dueDate, order?.status)
                        ? "ring-2 ring-red-400"
                        : ""
                    }`}
                  >
                    {order?.status?.replace("-", " ")?.toUpperCase()}
                    {isOverdue(order?.dueDate, order?.status) && (
                      <Icon
                        name="AlertTriangle"
                        size={12}
                        className="inline ml-1 text-red-600"
                      />
                    )}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm text-foreground">
                      Collected: {formatDate(order?.collectionDate)}
                    </p>
                    <p
                      className={`text-xs ${
                        isOverdue(order?.dueDate, order?.status)
                          ? "text-red-600 font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      Due: {formatDate(order?.dueDate)}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-foreground">
                    {order?.orderingPhysician}
                  </p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex space-x-2 justify-end">
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onOrderSelect(order);
                      }}
                      iconName="Eye"
                    ></Button>
                    {order?.status !== "completed" && (
                      <Button
                        size="xs"
                        variant="default"
                        onClick={(e) => {
                          e?.stopPropagation();
                          onUploadResults(order);
                        }}
                        iconName="Upload"
                      ></Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders?.length === 0 && (
        <div className="text-center py-12">
          <Icon
            name="TestTube"
            size={48}
            className="mx-auto text-muted-foreground mb-4"
          />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No orders found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
