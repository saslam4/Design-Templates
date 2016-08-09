
<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet"%>

<portlet:defineObjects />

<%
	String colorCode = portletPreferences.getValue("colorCode", "");
%>

<div style="color: <%=colorCode%>;font-weight:bold">This is configuration page demo portlet</div>