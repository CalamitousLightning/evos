import requests


def purchase_data(phone, network, plan):

    # Example payload
    payload = {
        "phone": phone,
        "network": network,
        "plan": plan
    }

    # Example provider API (placeholder)
    provider_url = "https://api.provider.com/data/purchase"

    try:
        response = requests.post(provider_url, json=payload, timeout=10)

        if response.status_code == 200:
            return True
        else:
            return False

    except Exception:
        return False
