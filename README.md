# hd-booking-backend

This is the backend service for hd booking application, built with Node.js, TypeScript, and MongoDB.

## Prerequisites

  * **Node.js** (v16 or later)
  * **npm**
  * A running **MongoDB** instance (local or cloud-based)

## Setup Instructions

1.  **Clone the repository:**

    ```sh
    git clone <your-repository-url>
    cd hd-booking-backend
    ```

2.  **Install dependencies:**
    This project uses `npm` and has a `package-lock.json`.

    ```sh
    npm install
    ```

3.  **Create Environment File:**
    Create a `.env` file in the root of the project. The server relies on this file for critical variables.

    ```env
    # Your MongoDB connection string
    MONGO_URI=mongodb://localhost:27017/hd-booking

    # The port to run the server on
    PORT=4000

    # The URL of your frontend application (for CORS)
    FRONTEND_URL=http://localhost:3000
    ```

## Run Instructions

1.  **Run the server:**
    The project uses `ts-node` (listed in `devDependencies`) to run TypeScript directly.

    ```sh
    npx ts-node src/index.ts
    ```

    The server will start on the `PORT` specified in your `.env` file (e.g., `Server started on PORT 4000`).

2.  **Populate Database (Optional):**
    To fill the database with sample experiences, slots, and promos, run the `populateData.ts` script.

    ```sh
    npx ts-node scripts/populateData.ts
    ```
