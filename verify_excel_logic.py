import sys
import os

# Add root to python path
sys.path.append(os.getcwd())

from backend.services.scheduled_export_service import ScheduledExportService


def test_excel_generation():
    print("Testing Excel generation logic...")

    # Mock data
    data = [{"col1": "value1", "col2": 123}, {"col1": "value2", "col2": 456}]

    # Mock service (we only need the method, which is instance method but doesn't use self state for formatting)
    # Using a dummy class if needed, or just instance.
    # The method uses 'self' but looking at the code, _format_as_excel uses 'self' param but checks 'data'.
    # It imports pandas inside validation ?? No, imports are at top.

    # _format_as_excel is an instance method.
    # It does not use 'self' typically for simple pandas conversion.

    service = ScheduledExportService(db=None)  # Mock DB as None

    try:
        excel_bytes = service._format_as_excel(data)

        print(f"Generated {len(excel_bytes)} bytes.")

        # Verify header (PK...)
        if excel_bytes.startswith(b"PK"):
            print("SUCCESS: Output looks like a valid Excel (Zip) file.")

            # Save to checking
            with open("test_verify.xlsx", "wb") as f:
                f.write(excel_bytes)
            print("Saved to test_verify.xlsx")
            return True
        else:
            print("FAILURE: Output does not start with PK header.")
            return False

    except Exception as e:
        print(f"Error: {e}")
        import traceback

        traceback.print_exc()
        return False


if __name__ == "__main__":
    if test_excel_generation():
        sys.exit(0)
    else:
        sys.exit(1)
