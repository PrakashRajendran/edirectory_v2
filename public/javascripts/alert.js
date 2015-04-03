function promptInputBusinessName() {
	var business_name = prompt ("Please enter the business name")
	if (business_name)
		window.location="/api/request-business/" + business_name;
}
