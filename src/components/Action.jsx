const Action = ({
  row,
  onEdit,
  onDelete,
  labelEdit,
  labelDelete,
  classEdit,
  classDelete,
  hideEdit,
  hideDelete,
}) => {
  return (
    <div className="flex">
      {!hideEdit && (
        <button
          onClick={() => onEdit(row)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          {...classEdit}
        >
          {labelEdit || "Edit"}
        </button>
      )}
      {!hideDelete && (
        <button
          onClick={() => onDelete(row)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          {...classDelete}
        >
          {labelDelete || "Delete"}
        </button>
      )}
    </div>
  );
};

export default Action;
