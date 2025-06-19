import React from "react";
import { ClientDetails } from "./client-details";

interface ClientDetailsWrapperProps {
  client: any;
  onDeleteSuccess: () => void;
}

const ClientDetailsWrapper: React.FC<ClientDetailsWrapperProps> = ({
  client,
  onDeleteSuccess,
}) => {
  return <ClientDetails client={client} onDeleteSuccess={onDeleteSuccess} />;
};

export default ClientDetailsWrapper;
