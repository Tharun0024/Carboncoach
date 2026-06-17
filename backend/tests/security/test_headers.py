from fastapi.testclient import TestClient

def test_security_headers_are_applied_to_endpoints(test_app: TestClient):
    """
    Verify that response from /health contains all five specified security headers.
    """
    response = test_app.get("/health")
    
    assert response.status_code == 200
    assert response.headers.get("X-Content-Type-Options") == "nosniff"
    assert response.headers.get("X-Frame-Options") == "DENY"
    assert response.headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"
    assert response.headers.get("Permissions-Policy") == "geolocation=(), microphone=(), camera=(), interest-cohort=()"
    assert response.headers.get("Content-Security-Policy") == "default-src 'self'; frame-ancestors 'none'; object-src 'none';"
