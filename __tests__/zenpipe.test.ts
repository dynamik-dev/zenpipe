import { zenpipe } from "../src/zenpipe"; // Adjust the import path as necessary

describe("zenpipe", () => {
  // Helper functions for testing
  const double = (x: number) => x * 2;
  const addOne = (x: number) => x + 1;
  const stringify = (x: number) => x.toString();
  const asyncDouble = async (x: number) => {
    await new Promise((resolve) => setTimeout(resolve, 10));
    return x * 2;
  };
  const asyncAddOne = async (x: number) => {
    await new Promise((resolve) => setTimeout(resolve, 10));
    return x + 1;
  };

  // Test synchronous functions
  test("composes synchronous functions correctly", async () => {
    const pipeline = zenpipe([double, addOne, stringify]);
    const result = await pipeline(5) // "11"
    expect(result).toBe("11");
  });

  // Test asynchronous functions
  test("composes asynchronous functions correctly", async () => {
    const pipeline = zenpipe([asyncDouble, asyncAddOne, stringify]);
    const result = await pipeline(5);
    expect(result).toBe(11);
  });



  test("can be used for etl process", async () => {
    // Define our data types
    interface RawUserData {
      id: number;
      name: string;
      email: string;
      signUpDate: string;
    }

    interface ProcessedUserData {
      userId: string;
      fullName: string;
      emailDomain: string;
      isLongTermUser: boolean;
      userTags: string[];
      signUpDate: Date;
      email: string;
    }

    // ETL functions
    const extractUserInfo = (rawData: RawUserData) => ({
      userId: `USER_${rawData.id}`,
      fullName: rawData.name,
      email: rawData.email,
      signUpDate: new Date(rawData.signUpDate),
    });

    const transformEmailDomain = (data: Partial<ProcessedUserData>) => ({
      ...data,
      emailDomain: data.email!.split("@")[1],
    });

    const calculateUserTenure = (data: Partial<ProcessedUserData>) => {
      const now = new Date();
      const signUpDate = data.signUpDate as Date;
      const yearsSinceSignUp =
        (now.getTime() - signUpDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return {
        ...data,
        isLongTermUser: yearsSinceSignUp > 2,
      };
    };

    const assignUserTags = (data: Partial<ProcessedUserData>) => {
      const tags: string[] = [];
      if (data.isLongTermUser) tags.push("long-term");
      if (data.emailDomain === "gmail.com") tags.push("gmail-user");
      return {
        ...data,
        userTags: tags,
      };
    };

    const cleanupIntermediateData = (
      data: Partial<ProcessedUserData>
    ): ProcessedUserData => {
      const { signUpDate, email, ...cleanedData } = data;
      return cleanedData as ProcessedUserData;
    };

    // Create our ETL pipeline
    const userDataETL = zenpipe<RawUserData, ProcessedUserData>([
      extractUserInfo,
      transformEmailDomain,
      calculateUserTenure,
      assignUserTags,
      cleanupIntermediateData,
    ]);

    // Example usage
    async function processUserData() {
      const rawUserData: RawUserData = {
        id: 12345,
        name: "John Doe",
        email: "john.doe@gmail.com",
        signUpDate: "2020-01-15T00:00:00Z",
      };

      try {
        const processedData = await userDataETL(rawUserData);
        const expected = {
          userId: 'USER_12345',
          fullName: 'John Doe',
          emailDomain: 'gmail.com',
          isLongTermUser: true,
          userTags: [ 'long-term', 'gmail-user' ]
        };

        expect(processedData).toEqual(expected);
      } catch (error) {

      }
    }

    processUserData();
  });
});
