<%@ taglib uri="http://liferay.com/tld/portlet" prefix="liferay-portlet"%>
<%@ taglib uri="http://liferay.com/tld/ui" prefix="liferay-ui" %>
<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet"%>
<liferay-portlet:actionURL var="configurationURL" 	portletConfiguration="true" />
<portlet:defineObjects />
<%
	String colorCode = portletPreferences.getValue("colorCode", "");
%>
<div id="color" style="padding-left: 10px;"></div>
<script>
	YUI().use('aui-color-picker-popover', function(Y) {
		var colorPicker = new Y.ColorPickerPopover({
			trigger : '.myColorPickerPopover'
		}).render();

		colorPicker.on('select', function(event) {
			event.trigger.setStyle('backgroundColor', event.color);
			Y.one('.colorCode').val(event.color);
		});

	});
</script>

<liferay-ui:success key="config-stored" message="Configuration Saved Successfully" />
<form name="fm" method="post" action="<%=configurationURL.toString()%>">

	<input  class="myColorPickerPopover" type="text" value="Click me..." style="background-color: <%=colorCode%>">
	Color Code: <input class="colorCode" type="text" name='<portlet:namespace/>colorCode' readonly value="<%=colorCode%>">
	<br/>
	<input type="submit" value="Save">
</form>
