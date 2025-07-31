-- This migration creates the trigger to power the Zapier integration.

-- Step 1: Create the function that will be called by our trigger.
-- This function finds the correct webhook URL and sends the new review data to it.
CREATE OR REPLACE FUNCTION public.send_webhook_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    webhook_url text;
    payload jsonb;
BEGIN
    -- Find the Zapier webhook URL for the business associated with this new review.
    SELECT
        bi.settings ->> 'webhook_url' INTO webhook_url
    FROM
        public.business_integrations bi
    JOIN
        public.integrations i ON bi.integration_id = i.id
    WHERE
        bi.business_id = NEW.business_id AND i.name = 'Zapier' AND bi.is_connected = true;

    -- If a webhook URL is found, proceed.
    IF webhook_url IS NOT NULL THEN
        -- Construct the JSON payload with the review data.
        payload := jsonb_build_object(
            'review_id', NEW.id,
            'title', NEW.title,
            'summary', NEW.summary,
            'overall_rating', NEW.overall_rating,
            'created_at', NEW.created_at,
            'business_id', NEW.business_id
            -- We can add more fields here in the future, like author name.
        );

        -- Use the pg_net extension to send the HTTP POST request.
        -- This is the A+++ way to handle external webhooks securely.
        PERFORM net.http_post(
            url := webhook_url,
            body := payload,
            headers := '{"Content-Type": "application/json"}'
        );
    END IF;

    RETURN NEW;
END;
$$;


-- Step 2: Create the trigger that runs the function.
-- This trigger will fire AFTER a review is updated, but only if the status
-- has been changed TO 'approved'.
CREATE TRIGGER on_review_approved_send_webhook
AFTER UPDATE OF status ON public.reviews
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM 'approved' AND NEW.status = 'approved')
EXECUTE FUNCTION public.send_webhook_notification();