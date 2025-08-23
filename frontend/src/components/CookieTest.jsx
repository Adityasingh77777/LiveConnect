import { useState } from "react";
import { axiosInstance } from "../lib/axios";

const CookieTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testCookies = async () => {
    setLoading(true);
    try {
      console.log("🧪 Testing cookie functionality...");
      console.log("🧪 Current cookies:", document.cookie);
      console.log("🧪 Frontend URL:", window.location.href);
      console.log("🧪 Backend URL:", axiosInstance.defaults.baseURL);
      
      const response = await axiosInstance.get("/test-cookies");
      console.log("🧪 Test response:", response.data);
      
      setTestResult({
        success: true,
        data: response.data,
        cookies: document.cookie,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("🧪 Cookie test failed:", error);
      setTestResult({
        success: false,
        error: error.message,
        cookies: document.cookie,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const clearTestResult = () => {
    setTestResult(null);
  };

  return (
    <div className="p-4 bg-base-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">🍪 Cookie Test</h3>
      
      <button 
        onClick={testCookies}
        disabled={loading}
        className="btn btn-primary mb-4"
      >
        {loading ? "Testing..." : "Test Cookies"}
      </button>

      {testResult && (
        <div className="space-y-4">
          <button 
            onClick={clearTestResult}
            className="btn btn-sm btn-outline"
          >
            Clear Results
          </button>
          
          <div className={`alert ${testResult.success ? 'alert-success' : 'alert-error'}`}>
            <div>
              <h4 className="font-bold">
                {testResult.success ? 'Test Passed' : 'Test Failed'}
              </h4>
              <div className="text-sm">
                <p><strong>Timestamp:</strong> {testResult.timestamp}</p>
                <p><strong>Current Cookies:</strong> {testResult.cookies || 'None'}</p>
                {testResult.success ? (
                  <p><strong>Response:</strong> {JSON.stringify(testResult.data, null, 2)}</p>
                ) : (
                  <p><strong>Error:</strong> {testResult.error}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookieTest;
