window.opentrace = {
	Hops: [],
	reset: function () {
		map.enableScrollWheelZoom(true); //滚轮
		map.clearOverlays(); //清除覆盖物
		this.Hops = [];
		if (document.getElementById("opentracePopup")) document.getElementById("opentracePopup").remove();
	},

	addHop: function (hop) {
		hop = JSON.parse(hop);
		console.log(hop);
		this.Hops.push(hop);
		// 重新计算中心点并画图
		map.clearOverlays(); //清除覆盖物
		var pointlygon_array = []; //折线需要的数组
		for (var i = 0; i < this.Hops.length; i++) {
			try {
				if (this.Hops[i].Longitude == 0 || this.Hops[i].Latitude == 0 || this.Hops[i].Longitude == "" || this.Hops[i].Latitude == "") continue;
				var point = new BMapGL.Point(this.Hops[i].Longitude, this.Hops[i].Latitude);
				let markerIndex = i;
				var marker = new BMapGL.Marker(point); //标创建注点
				map.addOverlay(marker); //添加覆盖物
				marker.setTitle(i + 1 + "：" + this.Hops[i].Geolocation);
				marker.addEventListener("mouseover", (e) => {
					this.showPopup(markerIndex);
				});
				pointlygon_array.push(new BMapGL.Point(this.Hops[i].Longitude, this.Hops[i].Latitude)); //创建线段用的坐标数组
			} catch (e) {}
		}
		if (pointlygon_array.length < 2) return;
		var polygon = new BMapGL.Polyline(pointlygon_array, { strokeColor: "red", strokeWeight: 2, strokeOpacity: 0.5 }); //创建折线
		//Polyline（坐标值，{线段颜色，线段宽度，线段透明度}）；
		map.addOverlay(polygon); //添加覆盖物
		map.setViewport(pointlygon_array); //设置地图的中心点和缩放级别
	},

	focusHop: function (hopNo) {
		var hop = this.Hops[hopNo];
		if (hop == null) return;
		this.showPopup(hopNo);
		var point = new BMapGL.Point(hop.Longitude, hop.Latitude);
		map.centerAndZoom(point, 8);
	},

	showPopup: function (hopNo) {
		var hop = this.Hops[hopNo];
		if (hop == null) return;
		if (document.getElementById("opentracePopup")) document.getElementById("opentracePopup").remove();
		// 创建左上角的悬浮提示
		var popupElement = document.createElement("div");
		popupElement.id = "opentracePopup";
		popupElement.style =
			"position: absolute; top: 10px; max-width: 33%; left: 10px; padding: 5px; background-color: rgba(255,255,255,0.85); border: 1px solid #ccc; border-radius: 5px; z-index: 9999;";
		popupElement.innerHTML = `
		<style>
		td:first-child {
			font-weight:bold;
			padding-right:5px;
		}
		</style>
		<table>
			<tr>
				<td style="white-space: nowrap;">IP #${hop.No}</td>
				<td>${hop.IP}</td>
			</tr>
			<tr>
				<td>Time</td>
				<td>${hop.Time}</td>
			</tr>
			<tr>
				<td>Geo</td>
				<td>${hop.Geolocation}</td>
			</tr>
			<tr>
				<td>Org</td>
				<td>${hop.Organization}</td>
			</tr>
			<tr>
				<td>AS</td>
				<td>${hop.AS}</td>
			</tr>
		</table>`;
		document.body.appendChild(popupElement);
	},
};

window.opentrace.reset();
