"use client";
import { useEffect, useState } from "react";
import { Modal, Button } from "@/components/ui";

export function PrivacyPopup() {
	const [showModal, setShowModal] = useState(false);
	useEffect(() => {
		if (
			typeof window !== "undefined" &&
			!window.sessionStorage.getItem("jobtracker_privacy_modal_shown")
		) {
			setShowModal(true);
		}
	}, []);
	const handleCloseModal = () => {
		setShowModal(false);
		if (typeof window !== "undefined") {
			window.sessionStorage.setItem(
				"jobtracker_privacy_modal_shown",
				"1",
			);
		}
	};

	return (
		<Modal open={showModal} onClose={handleCloseModal} size="sm">
			<div className="flex flex-col items-center gap-6 p-2 text-center">
				<div className="text-xl font-bold text-indigo-700">
					Relax, we are not farming your data
				</div>
				<div className="text-slate-700 text-base leading-relaxed">
					We do not have a database, and we do not store your personal
					information on this website.
					<br />
					<br />
					So no, we cannot profit from your data, track your every
					move, or pass your info around like party snacks.
					<br />
					<br />
					<b>
						You are here to find jobs.
						<br />
						Not to become the product.
					</b>
					<br />
					<br />
					Unlike... certain websites.
					<br />
					<span className="italic">COUGH COUGH... CHATGPT</span>
				</div>
				<Button
					size="md"
					variant="primary"
					onClick={handleCloseModal}
					autoFocus
				>
					Start job hunting
				</Button>
			</div>
		</Modal>
	);
}
