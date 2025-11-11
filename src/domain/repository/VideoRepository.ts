import databaseClient from "../../infrastructure/config/database/databaseClient";
import DatabaseErrorHelper from "../../utils/databaseError.helper";
import loggerMessage from "../../utils/logger";
import { VideoEntity } from "../entity/VideosEntity";
import { VideoRepositoryInterface } from "./interfaces/VideoRepositoryInterface";
import { FIND_ALL_VIDEOS_QUERY, FIND_VIDEO_BY_ID_QUERY, SAVE_VIDEO_QUERY } from "./queries/videoQueries";

class VideoRepository implements VideoRepositoryInterface {

    async findById(id: number): Promise<VideoEntity | null> {
        try {
            const result = await databaseClient.query<VideoEntity>(
                FIND_VIDEO_BY_ID_QUERY,
                [id],
            );

            return result.rows[0] || null;
        } catch (error: Error | any) {
            loggerMessage.error('Error to get video by id: ' + error.message);
            throw DatabaseErrorHelper.translate(error);
        }
    }

    async findAll(): Promise<VideoEntity[]> {
        try {
            const result = await databaseClient.query<VideoEntity>(
                FIND_ALL_VIDEOS_QUERY,
            );

            loggerMessage.debug('Videos retrieved: ' + JSON.stringify(result.rows));
            const savedVideo = result.rows;

            return savedVideo;
        } catch (error: Error | any) {
            loggerMessage.error('Error to get all videos: ' + error.message);
            throw DatabaseErrorHelper.translate(error);
        }
    }

    async save(entity: VideoEntity): Promise<number> {
        try {
            const result = await databaseClient.query<{ id: number, title: string }>(
                SAVE_VIDEO_QUERY,
                [
                    entity.producer_id,
                    entity.title,
                    entity.description || null,
                    entity.url,
                    entity.duration || null,
                    entity.category || null,
                    entity.created_by,
                    entity.last_update_by || null,
                ]
            );

            const savedVideo = result.rows[0];

            return savedVideo?.id!;
        } catch (error: Error | any) {
            loggerMessage.error('Error saving video: ' + error.message);
            throw DatabaseErrorHelper.translate(error);
        }
    }

    update(entity: VideoEntity): Promise<void> {
        throw new Error("Method not implemented.");
    }

    delete(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

}

export default VideoRepository;