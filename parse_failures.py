import re
import sys


def parse_pytest_failures(file_path):
    try:
        # Try different encodings
        content = ""
        for encoding in ["utf-16le", "utf-8", "latin1"]:
            try:
                with open(file_path, "r", encoding=encoding) as f:
                    content = f.read()
                print(f"Successfully read with {encoding}")
                break
            except Exception:
                continue

        if not content:
            print("Could not read file with any encoding")
            return

        print(f"File length: {len(content)}")

        # Look for the failure summary section
        failures = re.split(r"^_{3,} ", content, flags=re.MULTILINE)

        with open("failures_summary.txt", "w", encoding="utf-8") as out:
            out.write(f"Found {len(failures) - 1} failure blocks\n")

            for i, failure in enumerate(failures[1:], 1):
                lines = failure.split("\n")
                title = lines[0].strip("_ ")
                out.write(f"\nFailure {i}: {title}\n")

                # Print the next few lines for context/traceback
                for line in lines[1:30]:
                    if line.strip():
                        out.write(line + "\n")
        print("Wrote summary to failures_summary.txt")

    except Exception as e:
        print(f"Error parsing file: {e}")


if __name__ == "__main__":
    parse_pytest_failures("backend_test_fresh_no_ws.txt")
