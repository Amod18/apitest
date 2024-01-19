import json
from flask import Flask, jsonify
from flask import request as R
# from urllib.request import Request, urlopen  # Python 3
from urllib import request, parse
# import urllib.request, json
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)


@app.route("/fetchDataWater", methods=["POST", "GET"])
def fetch_data():
    data = R.get_json()
    regNo = data.get('RRNo')
    print("Reg num: ", regNo)
    apiUrl = "https://koneapi.cmsuat.co.in:3443/KarnatakaMobileOne/api/1.1/WaterBoard/WaterBoardDetails"
    data = parse.urlencode(
        {
            "RRNo": regNo,
            "SubDivisionID": "",
            "DuplicateCheckRequired": "N",
            "CityCode": "BN",
            "ServiceCityId": "97",
            "CityId": 2,
        }
    ).encode()
    req = request.Request(apiUrl, data=data)
    req.add_header("Authorization", "Basic a29uZW1vYjprb25lbW9i")
    req.add_header("auth_userid", "105")
    response = request.urlopen(req).read().decode('utf-8')  # Decode the response to a string
    jsonify(response)
    response = json.loads(response)
    # extracted_data = {
    #         "RRNumber": response["Result"]["ResponseData"]["RRNumber"],
    #         "ConsumerID": response["Result"]["ResponseData"]["ConsumerID"],
    #         "ConsumerName": response["Result"]["ResponseData"]["ConsumerName"],
    #         "Address": response["Result"]["ResponseData"]["Address"],
    #         "BillAmount": response["Result"]["ResponseData"]["BillAmount"],
    #         "BillNumber": response["Result"]["ResponseData"]["BillNumber"],
    #         "BillDate": response["Result"]["ResponseData"]["BillDate"],
    #         "IsPaid": response["Result"]["ResponseData"]["IsPaid"],
    #         "AmountPaid": response["Result"]["ResponseData"]["AmountPaid"]
    #     }

    return (response)


if __name__ == "__main__":
    app.run(debug=True)