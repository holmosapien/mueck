import time

from lib.log_handler import setup_logger

from lib.database import Database
from lib.image_generator import ImageGenerator
from lib.models.mueck import RawImageRequest, ParsedImageRequest
from lib.prompt_processor import PromptProcessor

logger = setup_logger()

class MueckWorker:
    def __init__(self):
        self.database = Database()
        self.generator = ImageGenerator()
        self.prompt_processor = PromptProcessor()

    def run(self):
        logger.info("Mueck worker started.")

        while True:
            queue = self.database.get_image_requests()

            for request in queue:
                request_id = request.request_id
                request_type = type(request)

                logger.info(f"Processing request {request_id} of type {request_type}")

                if request_type is RawImageRequest:
                    parsed_request = self.process_raw_image_request(request)
                elif request_type is ParsedImageRequest:
                    parsed_request = request
                else:
                    logger.info(f"Unknown request type {request_type}")

                    self.database.complete_request(request, [])

                    continue

                filenames = self.generator.generate_image(parsed_request)

                logger.info(f"Generated {len(filenames)} images for request {request_id}")

                self.database.complete_request(parsed_request, filenames)

                logger.info(f"Completed request {request_id}")

            time.sleep(10)

    def process_raw_image_request(self, request: RawImageRequest):
        parsed_request = self.prompt_processor.process(request)

        self.database.add_request_parameters(parsed_request)

        return parsed_request

if __name__ == "__main__":
    worker = MueckWorker()

    worker.run()