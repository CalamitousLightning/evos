import requests


PROVIDER_A = "https://api.providerA.com/data"
PROVIDER_B = "https://api.providerB.com/data"


def provider_a_purchase(phone, network, plan):

    payload = {
        "phone": phone,
        "network": network,
        "plan": plan
    }

    try:
        response = requests.post(PROVIDER_A, json=payload, timeout=10)

        if response.status_code == 200:
            return True
    except Exception:
        pass

    return False


def provider_b_purchase(phone, network, plan):

    payload = {
        "phone": phone,
        "network": network,
        "plan": plan
    }

    try:
        response = requests.post(PROVIDER_B, json=payload, timeout=10)

        if response.status_code == 200:
            return True
    except Exception:
        pass

    return False

def purchase_data(phone, network, plan):

    
    # Try Provider A first
    if provider_a_purchase(phone, network, plan):
        return True

    # If A fails try Provider B
    if provider_b_purchase(phone, network, plan):
        return True

    return False
