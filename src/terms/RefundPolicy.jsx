// TermsAndConditions.jsx
import React from "react";

const RefundPolicy = () => {
  return (
    <div className="pt-24 pb-20 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Terms &amp; Conditions</h1>
            <p className="text-sm text-gray-500">Last updated: January 13, 2026</p>
          </div>
          <div>
            {/* <button
              type="button"
              onClick={() => window.history.back()}
              className="text-sm px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
            >
              Back
            </button> */}
          </div>
        </div>

        <section className="prose prose-sm sm:prose lg:prose-lg text-gray-800">
            <h2>Refund Policy</h2>
         <p>   Salient Learnings appreciates and values your purchase on our website (https://www.salientlearnings.com/). We take our refund policy seriously and make sure go through it carefully. All defined terms used below shall have the meanings set forth in our Terms and Conditions. Check https://www.salientlearnings.com/terms-and-conditions/ </p>

<p>Salient Learnings (hereby referred as ‘Salient Learnings’), reserves the sole right to repeal or reschedule a training or change the trainer, because of insufficient enrollments, trainer / instructor unavailability or force majeure conditions.</p>
<strong>Refund policy in case training is cancelled by Salient Learnings:</strong>
<p>In case Salient Learnings cancels an event, 100% of course fees will be refunded to the delegate if the refund raise request is within 10 days of purchase of the course.</p>
<strong>If the delegate opts for cancellation/refund:</strong>
<p>Delegates should raise the request for refund within 3 business days after attending the first session (classroom/Instructor led online). A formal request for a refund should be made through an official email to info@salientlearnings.com from the date of the course commencement. Any refund request after the above time frame will not be entertained.</p>

<p>No refunds under any circumstances will be entertained if the delegate/participants attends 8 hours of the session</p>

<p>If the delegate/participant doesn’t attend even a single live session the refund request should be raised within 10 days from the day of the payment. Any request after the above time frame will not be entertained.</p>
<p>•	All the refunds will be processed within 10-20 business working days after the request for a refund has been raised and approved by Salient Learnings after Deducting respective taxes.</p>
<p>•	Any duplicate payment made will be refunded only after the request is raised by the delegate with payment proof. Such refunds are processed within 7 days from the day of intimation done by the delegate.</p>
<p>•	If the participant/Delegate has accessed any e-learning course or has attended Online Classrooms/received recordings then the refund request will not be entertained.</p>
<strong>If you have any other queries regarding our refund and rescheduling policy, drop us a mail at info@salientlearnings.com</strong>

        </section>
        </div>
      </div>
  );
};

export default RefundPolicy;