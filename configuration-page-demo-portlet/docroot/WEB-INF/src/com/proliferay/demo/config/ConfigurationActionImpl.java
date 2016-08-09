package com.proliferay.demo.config;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.PortletConfig;
import javax.portlet.PortletPreferences;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

import com.liferay.portal.kernel.portlet.ConfigurationAction;
import com.liferay.portal.kernel.servlet.SessionMessages;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portlet.PortletPreferencesFactoryUtil;
/**
 * 
 * @author Hamidul Islam 
 *
 */

public class ConfigurationActionImpl implements ConfigurationAction {
	
	/**
	 * When save the configuration page this process action will be called.
	 * But not the portlet's process action 
	 */

	@Override
	public void processAction(PortletConfig portletConfig,
			ActionRequest actionRequest, ActionResponse actionResponse)

	throws Exception {

		String portletResource = ParamUtil.getString(actionRequest,"portletResource");
		

		String colorCode = ParamUtil.getString(actionRequest, "colorCode", "");

		PortletPreferences prefs = PortletPreferencesFactoryUtil.getPortletSetup(actionRequest, portletResource);

		prefs.setValue("colorCode", colorCode);

		prefs.store();
		
		SessionMessages.add(actionRequest, "config-stored");
		
		/**
		 * The below line will refresh the view page of the portlet
		 */
		SessionMessages.add(actionRequest,portletConfig.getPortletName() + SessionMessages.KEY_SUFFIX_REFRESH_PORTLET,portletResource);
		
	}

	@Override
	public String render(PortletConfig portletConfig, RenderRequest renderRequest,
			RenderResponse renderResponse) throws Exception {
		/**
		 * When we click the setup tag in configuration page
		 * This page will be shown
		 */
		return "/configuration.jsp";
	}

}
