import React, { Component } from "react";

class Home extends Component {
	state = {
		videos: [],
		subtitles: [],
	};

	componentDidMount() {
		if (window.ipcRenderer) {
			window.ipcRenderer.on("load:videos", (e, videos) => {
				if (videos.length) {
					this.setState({ videos });
				}
			});

			window.ipcRenderer.on("load:subtitles", (e, subtitles) => {
				if (subtitles.length) {
					this.setState({ subtitles });
				}
			});
		}
	}

	videoDialog = () => {
		console.log("open dialog");
		window.ipcRenderer.send("dialog:videos", "");
	};
	subtitleDialog = () => {
		window.ipcRenderer.send("dialog:subtitles", "");
	};
	rename = () => {
		window.ipcRenderer.send("rename-files", "");
	};
	reload = () => {
		window.ipcRenderer.send("reload", "");
	};

	isReady = () => {
		if (this.state.videos.length && this.state.subtitles.length) return true;
		return false;
	};

	render() {
		return (
			<div className="container">
				<h1 className="hero-header text-center my-3">Match your video & subtitle files</h1>
				<div className="d-flex justify-content-center flex-column">
					<div className="row d-flex justify-content-center">
						<button
							className={`btn btn-success mx-2 ${!this.isReady ? "disabled" : ""}`}
							disabled={!this.isReady()}
							id="rename"
							onClick={this.rename}
						>
							Rename Files
						</button>
						<button
							className={`btn btn-warning mx-2 ${
								this.state.videos.length + this.state.subtitles.length === 0 ? "disabled" : ""
							}`}
							disabled={this.state.videos.length + this.state.subtitles.length === 0}
							id="reload"
							onClick={this.reload}
						>
							Reload
						</button>
					</div>
					<div className="file-list mt-3 mb-5">
						<div className="row file-list-buttons">
							<div className={`col file-list-button mx-2 ${this.state.videos.length ? "h-auto" : ""}`}>
								{!this.state.videos.length ? (
									<button
										className="btn btn-primary row"
										id="select-videos"
										onClick={this.videoDialog}
									>
										Select Videos
									</button>
								) : (
									<div className="row">
										<h3 className="file-list-header">Videos:</h3>
										<ul className="list-group pr-3" id="video-list">
											{this.state.videos.map((video) => (
												<li className="list-group-item d-flex justify-content-between align-items-center">
													{video}
												</li>
											))}
										</ul>
									</div>
								)}
							</div>
							<div className={`col file-list-button mx-2 ${this.state.subtitles.length ? "h-auto" : ""}`}>
								{!this.state.subtitles.length ? (
									<button
										className="btn btn-primary row"
										id="select-subtitles"
										onClick={this.subtitleDialog}
									>
										Select Subtitles
									</button>
								) : (
									<div className="row pl-3">
										<h3 className="file-list-header">Subtitles:</h3>
										<ul className="list-group" id="subtitle-list">
											{this.state.subtitles.map((subtitle) => (
												<li className="list-group-item d-flex justify-content-between align-items-center">
													{subtitle}
												</li>
											))}
										</ul>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
