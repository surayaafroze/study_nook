"use client";

import { AlertDialog, Button } from "@heroui/react";

export function BookinCancel({ bookingsId, onDeleted }) {

  const handleCancelBooking = async () => {
    if (!bookingsId) {
      console.log("Missing booking ID");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/bookings/${bookingsId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      console.log("Deleted:", data);

      if (onDeleted) {
        onDeleted(bookingsId);
      }

    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  return (
    <AlertDialog>
      <Button variant="danger">Cancel</Button>

      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-100">

            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>
                Cancel booking?
              </AlertDialog.Heading>
            </AlertDialog.Header>

            <AlertDialog.Body>
              This action will permanently remove this booking.
            </AlertDialog.Body>

            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                No
              </Button>

              <Button variant="danger" onPress={handleCancelBooking} slot="close">
                Yes, Cancel
              </Button>
            </AlertDialog.Footer>

          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}