Ext.define("CGP.configuration.ticket.TicketStore",{
	extend : "Ext.data.Store",
	model : 'CGP.configuration.ticket.TicketModel',
	remoteSort: true,
	autoLoad:false,
	pageSize:25,
	remoteFilter : true,
	proxy:{
		type : 'uxrest',
		url : adminPath + 'api/ticketReceivers',
		reader : {
			type : 'json',
			root : 'data.content'
		}
	}
});

